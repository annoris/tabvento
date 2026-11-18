"""Tabvento's own HTTP-to-engine integration, with real Chrome and a scripted model."""

import http.client
import json
import threading
import time

import pytest
from pydantic_ai.messages import ModelResponse, ToolCallPart
from pydantic_ai.models.function import FunctionModel

from tabvento.server import TabventoServer


@pytest.mark.chrome
def test_saved_connection_executes_a_mission_in_local_chrome(chrome_binary, tmp_path, monkeypatch):
	monkeypatch.setenv('BH_CHROME_PATH', chrome_binary)
	monkeypatch.setenv('ANONYMIZED_TELEMETRY', 'false')
	monkeypatch.setenv('BH_TELEMETRY', '0')
	calls = []

	def scripted(messages, info):
		calls.append(messages)
		if len(calls) == 1:
			return ModelResponse(
				parts=[
					ToolCallPart(
						'python',
						{
							'code': "new_tab('data:text/html,<title>Tabvento conectado</title>'); wait_for_load(); title = page_info()['title']"
						},
					)
				]
			)
		return ModelResponse(parts=[ToolCallPart('finish_from_repl', {'success': True, 'expression': 'title'})])

	model = FunctionModel(scripted)
	monkeypatch.setattr('tabvento.runner.build_model', lambda config: model)
	server = TabventoServer(('127.0.0.1', 0), tmp_path)
	server.store.set_setting(
		'contribution',
		{
			'verified': True,
			'wallet': '3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm',
			'tx_signature': '5' * 88,
			'amount_usd': 88.0,
		},
	)
	thread = threading.Thread(target=server.serve_forever, daemon=True)
	thread.start()

	def request(method, path, data=None):
		client = http.client.HTTPConnection('127.0.0.1', server.server_port, timeout=5)
		client.request(method, path, json.dumps(data) if data is not None else None, {'Content-Type': 'application/json'})
		response = client.getresponse()
		status, body = response.status, json.loads(response.read())
		client.close()
		assert status < 400, body
		return body

	try:
		request('POST', '/api/connections', {'provider': 'ollama', 'model': 'scripted-test-only'})
		mission = request('POST', '/api/missions', {'task': 'Leer el título de la página de prueba', 'mode': 'live'})['mission']
		deadline = time.monotonic() + 50
		while time.monotonic() < deadline:
			mission = request('GET', f'/api/missions/{mission["id"]}')['mission']
			if mission['status'] not in ('queued', 'running'):
				break
			time.sleep(0.1)
		assert mission['status'] == 'completed', mission
		assert mission['result'] == 'Tabvento conectado'
		assert len(calls) == 2
	finally:
		server.shutdown()
		server.server_close()
		thread.join(timeout=3)
