"""Local app integration tests. No providers, cloud browsers or developer credentials are used."""

from __future__ import annotations

import http.client
import json
import os
import tempfile
import threading
import time
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from tabvento.connections import build_model
from tabvento.server import TabventoServer
from tabvento.solana_gate import MIN_CONTRIBUTION_USD, SOLANA_WALLET
from tabvento.store import MissionStore


class TabventoAPITests(unittest.TestCase):
	def setUp(self):
		self.directory = tempfile.TemporaryDirectory()
		self.server = TabventoServer(('127.0.0.1', 0), Path(self.directory.name), demo_delay=0.02)
		self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
		self.thread.start()

	def tearDown(self):
		self.server.shutdown()
		self.server.server_close()
		self.thread.join(timeout=2)
		self.directory.cleanup()

	def request(self, method: str, path: str, data: dict | None = None, headers: dict | None = None):
		connection = http.client.HTTPConnection('127.0.0.1', self.server.server_port, timeout=3)
		body = json.dumps(data) if data is not None else None
		request_headers = {'Content-Type': 'application/json', **(headers or {})}
		connection.request(method, path, body, request_headers)
		response = connection.getresponse()
		status, content = response.status, response.read()
		connection.close()
		return status, json.loads(content)

	def wait_terminal(self, mission_id: str) -> dict:
		deadline = time.monotonic() + 3
		while time.monotonic() < deadline:
			_, response = self.request('GET', f'/api/missions/{mission_id}')
			if response['mission']['status'] not in ('queued', 'running'):
				return response['mission']
			time.sleep(0.01)
		self.fail('La misión de prueba no terminó.')

	def test_demo_persists_result_and_can_be_deleted(self):
		status, response = self.request('POST', '/api/missions', {'task': 'Compare three sample sources', 'mode': 'demo'})
		self.assertEqual(status, 201)
		mission_id = response['mission']['id']
		mission = self.wait_terminal(mission_id)
		self.assertEqual(mission['status'], 'completed')
		self.assertIn('SIMULATED DEMO', mission['result'])
		self.assertEqual(len(mission['steps']), 6)
		store = MissionStore(Path(self.directory.name) / 'missions.sqlite3')
		self.assertEqual(store.get(mission_id)['result'], mission['result'])
		self.assertEqual(self.request('GET', '/api/missions')[1]['missions'][0]['id'], mission_id)
		self.assertEqual(self.request('DELETE', f'/api/missions/{mission_id}'), (200, {'deleted': True}))
		self.assertEqual(self.request('GET', f'/api/missions/{mission_id}')[0], 404)

	def test_cancelled_worker_never_overwrites_status(self):
		self.server.runner.demo_delay = 0.3
		_, response = self.request('POST', '/api/missions', {'task': 'Una misión que se cancelará'})
		mission_id = response['mission']['id']
		self.assertEqual(self.request('DELETE', f'/api/missions/{mission_id}')[0], 409)
		status, response = self.request('POST', f'/api/missions/{mission_id}/cancel')
		self.assertEqual(status, 200)
		self.assertEqual(response['mission']['status'], 'cancelled')
		time.sleep(0.1)
		mission = self.server.store.get(mission_id)
		self.assertEqual(mission['status'], 'cancelled')
		self.assertIsNone(mission['result'])

	def test_live_requires_explicit_model_before_worker_starts(self):
		status, _ = self.request('POST', '/api/missions', {'task': 'No ejecutar un proveedor', 'mode': 'live'})
		self.assertEqual(status, 400)
		self.assertEqual(self.server.store.list(), [])

	def test_cancel_race_preserves_result_that_already_completed(self):
		mission = self.server.store.create('Finaliza mientras llega la cancelación', 'demo', '')
		self.server.store.update(mission['id'], status='running')
		stale = self.server.store.get(mission['id'])
		self.server.store.update(mission['id'], status='completed', result='Un resultado ya confirmado')
		with patch.object(self.server.store, 'get', return_value=stale):
			response = self.server.runner.cancel(mission['id'])
		self.assertEqual(response['status'], 'completed')
		self.assertEqual(response['result'], 'Un resultado ya confirmado')

	def test_worker_capacity_is_enforced_atomically_after_http_precheck(self):
		self.server.runner.demo_delay = 1
		# Simulate several requests passing the non-atomic HTTP admission check together.
		with patch.object(self.server.runner, 'active', return_value=0):
			for index in range(3):
				self.assertEqual(self.request('POST', '/api/missions', {'task': f'Misión de capacidad {index}'})[0], 201)
			self.assertEqual(self.request('POST', '/api/missions', {'task': 'No exceder la capacidad'})[0], 409)
		self.assertEqual(len(self.server.store.list()), 3)

	def test_rejects_invalid_input_without_creating_missions(self):
		for data in ({'task': 'x'}, {'task': 123}, {'task': 'válida', 'mode': 'other'}, {'task': 'válida', 'model': []}):
			with self.subTest(data=data):
				self.assertEqual(self.request('POST', '/api/missions', data)[0], 400)
		self.assertEqual(self.server.store.list(), [])

	def test_cross_origin_and_dns_rebinding_requests_are_blocked(self):
		for headers in ({'Origin': 'https://evil.example'}, {'Host': 'evil.example'}, {'Sec-Fetch-Site': 'cross-site'}):
			with self.subTest(headers=headers):
				self.assertEqual(self.request('POST', '/api/missions', {'task': 'No debe iniciarse'}, headers)[0], 403)
		self.assertEqual(self.server.store.list(), [])

	def test_status_only_exposes_credential_presence(self):
		with patch.dict('os.environ', {'OPENAI_API_KEY': 'tabvento-test-secret'}):
			status, response = self.request('GET', '/api/status')
		self.assertEqual(status, 200)
		self.assertIs(response['credentials']['openai'], True)
		self.assertNotIn('tabvento-test-secret', json.dumps(response))
		self.assertTrue(response['demo_available'])

	def test_static_traversal_cannot_read_private_files(self):
		for path in ('/../server.py', '/%2e%2e/server.py', '/%2e%2e/%2e%2e/.env', '/api/unknown'):
			with self.subTest(path=path):
				self.assertEqual(self.request('GET', path)[0], 404)

	def test_oversized_request_is_rejected(self):
		status, _ = self.request('POST', '/api/missions', {'task': 'x' * 20_000})
		self.assertEqual(status, 413)

	def test_duplicate_launch_cannot_recover_an_active_servers_missions(self):
		mission = self.server.store.create('Existing active mission', 'live', 'test:model')
		for port in (self.server.server_port, 0):
			with self.subTest(port=port):
				with self.assertRaises(OSError):
					TabventoServer(('127.0.0.1', port), Path(self.directory.name))
				self.assertEqual(self.server.store.get(mission['id'])['status'], 'queued')

	def test_closed_server_releases_data_directory_for_restart(self):
		with tempfile.TemporaryDirectory() as directory:
			data_dir = Path(directory)
			first = TabventoServer(('127.0.0.1', 0), data_dir)
			mission = first.store.create('Interrupted mission', 'live', 'test:model')
			first.server_close()
			second = TabventoServer(('127.0.0.1', 0), data_dir)
			try:
				self.assertEqual(second.store.get(mission['id'])['status'], 'failed')
			finally:
				second.server_close()

	def test_restart_marks_unfinished_missions_as_interrupted(self):
		mission = self.server.store.create('Worker no longer exists', 'live', 'test:model')
		self.server.store.recover()
		recovered = self.server.store.get(mission['id'])
		self.assertEqual(recovered['status'], 'failed')
		self.assertIn('restarted', recovered['error'])

	def test_old_unfinished_missions_are_recovered_and_counted_beyond_200(self):
		old = self.server.store.create('Misión antigua interrumpida', 'live', 'openai:test')
		for index in range(201):
			mission = self.server.store.create(f'Historial posterior {index}', 'demo', '')
			self.server.store.update(mission['id'], status='completed', result='simulado')
		self.server.store.recover()
		self.assertEqual(self.server.store.get(old['id'])['status'], 'failed')
		self.assertEqual(len(self.request('GET', '/api/missions')[1]['missions']), 202)
		self.assertEqual(self.request('GET', '/api/status')[1]['stats'], {'total': 202, 'completed': 201})

	def test_storage_closes_database_connection_after_each_operation(self):
		with patch('tabvento.store.sqlite3.connect') as connect:
			connection = connect.return_value
			connection.__enter__.return_value = connection
			connection.execute.return_value.fetchone.return_value = None
			self.assertIsNone(self.server.store.get('missing'))
			connection.close.assert_called_once()

	def test_live_uses_explicit_model_local_browser_and_closes_agent(self):
		self.server.store.set_setting(
			'contribution',
			{'verified': True, 'wallet': SOLANA_WALLET, 'tx_signature': '5' * 88, 'amount_usd': 88.0},
		)
		calls = {}

		class FakeAgent:
			def __init__(self, task, **kwargs):
				calls.update(task=task, **kwargs)

			async def run(self, **kwargs):
				calls['run'] = kwargs
				return SimpleNamespace(
					status='completed', final_result=lambda: 'Resultado real de prueba', is_successful=lambda: True
				)

			async def close(self):
				calls['closed'] = True

		def browser(kind):
			calls['browser_kind'] = kind
			calls['telemetry'] = (os.getenv('ANONYMIZED_TELEMETRY'), os.getenv('BH_TELEMETRY'))
			return 'local-browser-test'

		fake_engine = SimpleNamespace(Agent=FakeAgent, Browser=browser)
		with (
			patch.dict('sys.modules', {'browser_use': fake_engine}),
			patch('tabvento.runner.build_model', return_value='direct-model-test') as build,
			patch.dict('os.environ', {'ANONYMIZED_TELEMETRY': 'true', 'BH_TELEMETRY': '1'}),
		):
			status, response = self.request(
				'POST', '/api/missions', {'task': 'Prueba del adaptador real', 'mode': 'live', 'model': 'custom:future-model'}
			)
			self.assertEqual(status, 201)
			mission = self.wait_terminal(response['mission']['id'])
			deadline = time.monotonic() + 2
			while self.server.runner.active() and time.monotonic() < deadline:
				time.sleep(0.01)
		self.assertEqual(mission['status'], 'completed')
		self.assertEqual(mission['result'], 'Resultado real de prueba')
		self.assertEqual(calls['llm'], 'direct-model-test')
		self.assertEqual(build.call_args.args[0]['model'], 'custom:future-model')
		self.assertIs(calls['web_search'], False)
		self.assertEqual(calls['browser_kind'], 'chromium')
		self.assertEqual(calls['telemetry'], ('false', '0'))
		self.assertTrue(calls['closed'])
		self.assertEqual(calls['run'], {'max_steps': 40, 'timeout': 300})

	def test_connections_persist_configuration_without_accepting_credentials(self):
		config = {'provider': 'ollama', 'model': 'my-new-local-model'}
		status, saved = self.request('POST', '/api/connections', config)
		self.assertEqual(status, 200)
		self.assertEqual(saved['connection']['base_url'], 'http://127.0.0.1:11434/v1')
		self.assertEqual(self.request('GET', '/api/connections')[1]['connection'], saved['connection'])
		store = MissionStore(Path(self.directory.name) / 'missions.sqlite3')
		self.assertEqual(store.get_setting('connection'), saved['connection'])
		self.assertEqual(self.request('POST', '/api/connections', {**config, 'api_key': 'must-not-be-saved'})[0], 400)
		self.assertNotIn('must-not-be-saved', json.dumps(store.get_setting('connection')))

	def test_provider_error_redaction_happens_before_length_truncation(self):
		self.server.store.set_setting(
			'contribution',
			{'verified': True, 'wallet': SOLANA_WALLET, 'tx_signature': '5' * 88, 'amount_usd': 88.0},
		)
		secret = 'private-compatible-key-' + 'z' * 60

		async def fail(mission, cancelled):
			raise RuntimeError('x' * 1179 + secret)

		with (
			patch.dict('os.environ', {'TABVENTO_COMPATIBLE_API_KEY': secret}),
			patch.object(self.server.runner, '_live', side_effect=fail),
		):
			_, response = self.request(
				'POST', '/api/missions', {'task': 'No exponer claves en errores', 'mode': 'live', 'model': 'openai:test'}
			)
			mission = self.wait_terminal(response['mission']['id'])
		self.assertEqual(mission['status'], 'failed')
		self.assertNotIn(secret[:20], mission['error'])
		self.assertIn('[redacted credential]', mission['error'])

	def test_connection_check_is_explicitly_local_and_never_verifies_authentication(self):
		self.request('POST', '/api/connections', {'provider': 'ollama', 'model': 'local-model'})
		with patch('urllib.request.urlopen', side_effect=AssertionError('No network checks')):
			status, checked = self.request('POST', '/api/connections/check', {})
		self.assertEqual(status, 200)
		self.assertEqual(checked['scope'], 'configuration')
		self.assertIs(checked['authentication_verified'], False)
		self.assertTrue(next(item for item in checked['checks'] if item['id'] == 'credential')['ok'])

	def test_connections_reject_urls_with_embedded_secrets_and_upstream_gateways(self):
		for url in (
			'https://user:password@example.com/v1',
			'https://example.com/v1?key=secret',
			'https://api.browser-use.com/api/v4/llm/v1',
			'file:///tmp/model',
		):
			with self.subTest(url=url):
				self.assertEqual(
					self.request(
						'POST', '/api/connections', {'provider': 'compatible', 'model': 'unchanged-model', 'base_url': url}
					)[0],
					400,
				)

	def test_live_mission_snapshots_saved_connection(self):
		self.server.store.set_setting(
			'contribution',
			{'verified': True, 'wallet': SOLANA_WALLET, 'tx_signature': '5' * 88, 'amount_usd': 88.0},
		)
		self.request('POST', '/api/connections', {'provider': 'ollama', 'model': 'local-model:latest'})
		with patch.object(self.server.runner, 'submit'):
			status, response = self.request('POST', '/api/missions', {'task': 'Usar mi conexión propia', 'mode': 'live'})
		self.assertEqual(status, 201)
		self.assertEqual(response['mission']['model'], 'local-model:latest')
		self.assertEqual(response['mission']['connection']['provider'], 'ollama')

	def test_direct_adapters_preserve_model_and_never_use_upstream_gateway(self):
		with (
			patch.dict('sys.modules', {'browser_use': None}),
			patch.dict(
				'os.environ', {'OPENAI_API_KEY': 'own-key', 'OPENAI_BASE_URL': 'https://api.browser-use.com/api/v4/llm/v1'}
			),
		):
			openai = build_model({'provider': 'openai', 'model': 'future-model-exact'})
			ollama = build_model({'provider': 'ollama', 'model': 'my-model:custom'})
		self.assertEqual(openai.model_name, 'future-model-exact')
		self.assertEqual(str(openai.client.base_url).rstrip('/'), 'https://api.openai.com/v1')
		self.assertEqual(openai.client.api_key, 'own-key')
		self.assertEqual(ollama.model_name, 'my-model:custom')
		self.assertEqual(str(ollama.client.base_url).rstrip('/'), 'http://127.0.0.1:11434/v1')
		self.assertEqual(ollama.client.api_key, 'tabvento-local')

	def test_english_accept_language_for_connections_and_checks(self):
		en_headers = {'Accept-Language': 'en-US,en;q=0.9'}
		status, conn_resp = self.request('GET', '/api/connections', headers=en_headers)
		self.assertEqual(status, 200)
		labels = {p['id']: p['label'] for p in conn_resp['providers']}
		self.assertEqual(labels['ollama'], 'Local Ollama')
		self.assertEqual(labels['compatible'], 'OpenAI-compatible API')

		status, check_unconfigured = self.request('POST', '/api/connections/check', {}, headers=en_headers)
		self.assertEqual(status, 200)
		self.assertIn('Only local configuration was checked.', check_unconfigured['message'])
		self.assertEqual(check_unconfigured['checks'][0]['label'], 'Provider and model')
		self.assertIn('Save a connection', check_unconfigured['checks'][0]['detail'])

		status, saved = self.request('POST', '/api/connections', {'provider': 'ollama', 'model': 'en-model'}, headers=en_headers)
		self.assertEqual(status, 200)
		self.assertEqual(
			next(p['label'] for p in saved['providers'] if p['id'] == 'ollama'),
			'Local Ollama',
		)

		status, check_configured = self.request('POST', '/api/connections/check', {}, headers=en_headers)
		self.assertEqual(status, 200)
		self.assertEqual(check_configured['checks'][0]['detail'], 'Local Ollama · en-model')
		self.assertEqual(check_configured['checks'][1]['label'], 'Credential in environment')
		self.assertIn('No key required', check_configured['checks'][1]['detail'])

		status, bad_conn = self.request('POST', '/api/connections', {'provider': 'invalid', 'model': 'x'}, headers=en_headers)
		self.assertEqual(status, 400)
		self.assertEqual(bad_conn['error'], 'Select a direct Tabvento provider.')

	def test_english_demo_mission_execution_and_error_messages(self):
		en_headers = {'Accept-Language': 'en'}
		status, bad_task = self.request('POST', '/api/missions', {'task': 'x'}, headers=en_headers)
		self.assertEqual(status, 400)
		self.assertEqual(bad_task['error'], 'Enter a goal between 3 and 4000 characters.')

		status, live_err = self.request(
			'POST', '/api/missions', {'task': 'Missing model test', 'mode': 'live'}, headers=en_headers
		)
		self.assertEqual(status, 400)
		self.assertIn('Configure your own connection', live_err['error'])

		status, not_found = self.request('GET', '/api/missions/' + 'b' * 32, headers=en_headers)
		self.assertEqual(status, 404)
		self.assertEqual(not_found['error'], 'Mission not found.')

		status, response = self.request(
			'POST', '/api/missions', {'task': 'Compare three sample sources', 'mode': 'demo'}, headers=en_headers
		)
		self.assertEqual(status, 201)
		mission_id = response['mission']['id']
		mission = self.wait_terminal(mission_id)
		self.assertEqual(mission['status'], 'completed')
		self.assertIn('SIMULATED DEMO', mission['result'])
		self.assertIn('Goal received: Compare three sample sources', mission['result'])
		self.assertEqual(mission['steps'][0]['label'], 'Simulated demo started.')
		self.assertEqual(mission['steps'][-1]['label'], 'Demo completed.')

	def test_solana_contribution_gate_enforces_min_88_usd_with_no_max_and_unlocks_live_mode(self):
		status, info = self.request('GET', '/api/contribution')
		self.assertEqual(status, 200)
		contrib = info['contribution']
		self.assertEqual(contrib['wallet'], SOLANA_WALLET)
		self.assertEqual(contrib['min_contribution_usd'], MIN_CONTRIBUTION_USD)
		self.assertEqual(contrib['min_contribution_usd'], 88)
		self.assertIsNone(contrib['max_contribution_usd'])
		self.assertFalse(contrib['verified'])
		self.assertTrue(contrib['device_code'].startswith('TV-'))
		self.assertIn(SOLANA_WALLET, contrib['solana_pay_url'])

		# Configure connection, then verify live mode returns 402 before Solana verification
		self.request('POST', '/api/connections', {'provider': 'ollama', 'model': 'local-model'})
		status, gate_en = self.request('POST', '/api/missions', {'task': 'Unverified live mission', 'mode': 'live'})
		self.assertEqual(status, 402)
		self.assertIn('minimum $88 USD', gate_en['error'])
		self.assertIn('no maximum limit', gate_en['error'])
		self.assertIn(SOLANA_WALLET, gate_en['error'])

		# Defense-in-depth: runner._live also blocks direct execution if store contribution is unverified
		import asyncio

		with self.assertRaises(RuntimeError) as ctx:
			asyncio.run(self.server.runner._live({'id': 'a' * 32, 'task': 'Direct call', 'mode': 'live'}, threading.Event()))
		self.assertIn('$88 USD', str(ctx.exception))
		self.assertIn(SOLANA_WALLET, str(ctx.exception))

		status, gate_es = self.request(
			'POST',
			'/api/missions',
			{'task': 'Misión en vivo sin verificar', 'mode': 'live'},
			headers={'Accept-Language': 'es'},
		)
		self.assertEqual(status, 402)
		self.assertIn('$88 USD', gate_es['error'])
		self.assertIn(SOLANA_WALLET, gate_es['error'])
		self.assertEqual(self.server.store.list(), [])

		# Invalid Base58 signature rejected
		status, bad_sig = self.request('POST', '/api/contribution/verify', {'signature': 'invalid-short-sig'})
		self.assertEqual(status, 400)
		self.assertIn('Base58', bad_sig['error'])

		# Simulated Solana RPC: transaction below $88 USD (e.g. 0.2 SOL = $35.20 at $176/SOL) is rejected
		valid_sig = '5' * 88

		class FakeRPCResponse:
			def __init__(self, payload: dict):
				self._bytes = json.dumps(payload).encode('utf-8')

			def read(self) -> bytes:
				return self._bytes

			def __enter__(self):
				return self

			def __exit__(self, *args):
				return False

		under_min_rpc = {
			'jsonrpc': '2.0',
			'id': 1,
			'result': {
				'meta': {
					'err': None,
					'preBalances': [1_000_000_000, 0],
					'postBalances': [800_000_000, 200_000_000],
				},
				'transaction': {
					'message': {
						'accountKeys': ['Sender1111111111111111111111111111111111111', SOLANA_WALLET],
					}
				},
			},
		}
		with patch('urllib.request.urlopen', return_value=FakeRPCResponse(under_min_rpc)):
			status, under_err = self.request('POST', '/api/contribution/verify', {'signature': valid_sig})
		self.assertEqual(status, 400)
		self.assertIn('$88 USD', under_err['error'])
		self.assertFalse(self.request('GET', '/api/contribution')[1]['contribution']['verified'])

		# Simulated Solana RPC: high contribution ($500 USD in USDC, no maximum limit) succeeds and unlocks live mode
		high_usdc_rpc = {
			'jsonrpc': '2.0',
			'id': 1,
			'result': {
				'meta': {
					'err': None,
					'preBalances': [1_000_000_000, 0],
					'postBalances': [1_000_000_000, 0],
					'preTokenBalances': [],
					'postTokenBalances': [
						{
							'owner': SOLANA_WALLET,
							'mint': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
							'uiTokenAmount': {'uiAmount': 500.0, 'decimals': 6, 'amount': '500000000'},
						}
					],
				},
				'transaction': {
					'message': {
						'accountKeys': [{'pubkey': SOLANA_WALLET}],
					}
				},
			},
		}
		with patch('urllib.request.urlopen', return_value=FakeRPCResponse(high_usdc_rpc)):
			status, verified_resp = self.request('POST', '/api/contribution/verify', {'signature': valid_sig})
		self.assertEqual(status, 200)
		self.assertTrue(verified_resp['verified'])
		self.assertEqual(verified_resp['contribution']['amount_usd'], 500.0)
		self.assertEqual(verified_resp['contribution']['currency'], 'USDC')
		self.assertEqual(verified_resp['contribution']['tx_signature'], valid_sig)

		with patch.object(self.server.runner, 'submit'):
			status, live_ok = self.request('POST', '/api/missions', {'task': 'Misión real desbloqueada', 'mode': 'live'})
		self.assertEqual(status, 201)
		self.assertEqual(live_ok['mission']['mode'], 'live')


if __name__ == '__main__':
	unittest.main()
