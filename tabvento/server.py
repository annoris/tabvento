"""Loopback-only HTTP API and static application server for Tabvento."""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import BinaryIO
from urllib.parse import parse_qs, unquote, urlsplit

from tabvento import __version__
from tabvento.connections import check_config, engine_available, legacy_config, normalize_config, provider_list
from tabvento.runner import MissionLimitError, MissionRunner
from tabvento.solana_gate import (
	contribution_status,
	is_contribution_verified,
	live_gate_message,
	verify_and_save_contribution,
)
from tabvento.store import MissionStore

MAX_BODY = 16_384
MISSION_PATH = re.compile(r'^/api/missions/([a-f0-9]{32})(/cancel)?$')


class TabventoServer(ThreadingHTTPServer):
	daemon_threads = True

	def __init__(self, address: tuple[str, int], data_dir: Path, *, demo_delay: float = 0.7):
		self._data_lock: BinaryIO | None = None
		self.runner: MissionRunner
		super().__init__(address, RequestHandler, bind_and_activate=False)
		try:
			# Reject an occupied port before opening or recovering mission history.
			self.server_bind()
			data_dir.mkdir(parents=True, exist_ok=True)
			self._data_lock = (data_dir / '.server.lock').open('a+b')
			try:
				if os.name == 'nt':
					import msvcrt

					if not self._data_lock.seek(0, os.SEEK_END):
						self._data_lock.write(b'0')
						self._data_lock.flush()
					self._data_lock.seek(0)
					msvcrt.locking(self._data_lock.fileno(), msvcrt.LK_NBLCK, 1)
				else:
					import fcntl

					fcntl.flock(self._data_lock.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
			except OSError as error:
				raise OSError(
					'Tabvento is already using this data directory. Close that instance or choose --data-dir.'
				) from error
			self.store = MissionStore(data_dir / 'missions.sqlite3')
			self.store.recover()
			self.runner = MissionRunner(self.store, data_dir / 'workspaces', demo_delay)
			self.static_dir = Path(__file__).parent / 'web'
			self.server_activate()
		except BaseException:
			self.server_close()
			raise

	def server_close(self) -> None:
		if hasattr(self, 'runner'):
			self.runner.close()
		super().server_close()
		if self._data_lock is not None:
			# Closing releases the OS lock, including after crashes; leave the inode in
			# place so concurrent starters always lock the same file.
			self._data_lock.close()
			self._data_lock = None


class RequestHandler(BaseHTTPRequestHandler):
	server: TabventoServer
	server_version = 'Tabvento'

	def log_message(self, format: str, *args) -> None:
		# Task text and credentials do not belong in access logs.
		pass

	def _lang(self, data: dict | None = None) -> str:
		if isinstance(data, dict):
			body_lang = data.get('lang')
			if isinstance(body_lang, str):
				cleaned = body_lang.strip().lower()
				if cleaned.startswith('en'):
					return 'en'
				if cleaned.startswith('es'):
					return 'es'
		query = parse_qs(urlsplit(self.path).query)
		if query.get('lang'):
			q_lang = query['lang'][0].strip().lower()
			if q_lang.startswith('en'):
				return 'en'
			if q_lang.startswith('es'):
				return 'es'
		header = self.headers.get('Accept-Language', '').strip().lower()
		if header.startswith('es'):
			return 'es'
		return 'en'

	def _headers(self, status: int, content_type: str, length: int) -> None:
		self.send_response(status)
		self.send_header('Content-Type', content_type)
		self.send_header('Content-Length', str(length))
		self.send_header('X-Content-Type-Options', 'nosniff')
		self.send_header('Referrer-Policy', 'no-referrer')
		self.send_header('Cache-Control', 'no-store')
		self.send_header(
			'Content-Security-Policy',
			"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
		)
		self.end_headers()

	def _json(self, status: int, value: dict) -> None:
		body = json.dumps(value, ensure_ascii=False).encode('utf-8')
		self._headers(status, 'application/json; charset=utf-8', len(body))
		self.wfile.write(body)

	def _error(self, status: int, message: str) -> None:
		self._json(status, {'error': message})

	def _local_request(self, *, mutation: bool = False) -> bool:
		en = self._lang() == 'en'
		port = self.server.server_port
		host = self.headers.get('Host', '')
		if host not in (f'127.0.0.1:{port}', f'localhost:{port}'):
			self._error(
				HTTPStatus.FORBIDDEN, 'Only local connections are allowed.' if en else 'Solo se permiten conexiones locales.'
			)
			return False
		origin = self.headers.get('Origin')
		if origin and origin not in (f'http://127.0.0.1:{port}', f'http://localhost:{port}'):
			self._error(HTTPStatus.FORBIDDEN, 'Origin not allowed.' if en else 'Origen no permitido.')
			return False
		if mutation and self.headers.get('Sec-Fetch-Site') == 'cross-site':
			self._error(
				HTTPStatus.FORBIDDEN,
				'Cross-site requests are not allowed.' if en else 'No se permiten solicitudes de otros sitios.',
			)
			return False
		return True

	def _body(self) -> dict | None:
		en = self._lang() == 'en'
		try:
			length = int(self.headers.get('Content-Length', '0'))
		except ValueError:
			self._error(HTTPStatus.BAD_REQUEST, 'Invalid request length.' if en else 'Longitud de solicitud inválida.')
			return None
		if not 0 < length <= MAX_BODY:
			self._error(
				HTTPStatus.REQUEST_ENTITY_TOO_LARGE,
				'JSON body must be between 1 and 16384 bytes.' if en else 'El cuerpo JSON debe ocupar entre 1 y 16384 bytes.',
			)
			return None
		if self.headers.get_content_type() != 'application/json':
			self._error(
				HTTPStatus.UNSUPPORTED_MEDIA_TYPE,
				'Send an application/json body.' if en else 'Envía un cuerpo application/json.',
			)
			return None
		try:
			data = json.loads(self.rfile.read(length))
			if not isinstance(data, dict):
				raise ValueError
		except (ValueError, UnicodeError):
			self._error(
				HTTPStatus.BAD_REQUEST,
				'Body must be a valid JSON object.' if en else 'El cuerpo debe ser un objeto JSON válido.',
			)
			return None
		return data

	def do_GET(self) -> None:
		if not self._local_request():
			return
		lang = self._lang()
		en = lang == 'en'
		path = urlsplit(self.path).path
		if path == '/api/status':
			missions = self.server.store.list()
			self._json(
				200,
				{
					'app': 'Tabvento',
					'version': __version__,
					'engine_available': engine_available(),
					'demo_available': True,
					'live_requires_model': True,
					'browser': 'chromium',
					'active_missions': self.server.runner.active(),
					'credentials': {
						name: bool(os.getenv(variable))
						for name, variable in {
							'openai': 'OPENAI_API_KEY',
							'anthropic': 'ANTHROPIC_API_KEY',
							'google': 'GOOGLE_API_KEY',
						}.items()
					},
					'contribution': contribution_status(self.server.store),
					'stats': {'total': len(missions), 'completed': sum(m['status'] == 'completed' for m in missions)},
				},
			)
		elif path == '/api/missions':
			self._json(200, {'missions': self.server.store.list()})
		elif path == '/api/connections':
			self._json(200, {'providers': provider_list(lang), 'connection': self.server.store.get_setting('connection')})
		elif path == '/api/contribution':
			self._json(200, {'contribution': contribution_status(self.server.store)})
		elif match := MISSION_PATH.fullmatch(path):
			mission = self.server.store.get(match[1])
			if mission and not match[2]:
				self._json(200, {'mission': mission})
			else:
				self._error(404, 'Mission not found.' if en else 'Misión no encontrada.')
		elif path.startswith('/api/'):
			self._error(404, 'Route not found.' if en else 'Ruta no encontrada.')
		else:
			self._static(path)

	def _static(self, path: str) -> None:
		en = self._lang() == 'en'
		root = self.server.static_dir.resolve()
		decoded = unquote(path)
		file = (root / (decoded.lstrip('/') or 'index.html')).resolve()
		if not file.is_relative_to(root) or not file.is_file():
			self._error(404, 'File not found.' if en else 'Archivo no encontrado.')
			return
		body = file.read_bytes()
		mime = mimetypes.guess_type(str(file))[0] or 'application/octet-stream'
		self._headers(
			200, mime + ('; charset=utf-8' if mime.startswith('text/') or mime == 'application/javascript' else ''), len(body)
		)
		self.wfile.write(body)

	def do_POST(self) -> None:
		if not self._local_request(mutation=True):
			return
		lang = self._lang()
		en = lang == 'en'
		path = urlsplit(self.path).path
		if path in ('/api/connections', '/api/connections/check'):
			data = self._body()
			if data is None:
				return
			lang = self._lang(data)
			en = lang == 'en'
			config_data = {k: v for k, v in data.items() if k != 'lang'}
			try:
				if path.endswith('/check'):
					config = (
						normalize_config(config_data, lang=lang) if config_data else self.server.store.get_setting('connection')
					)
					self._json(200, check_config(config, lang=lang))
				else:
					config = normalize_config(config_data, lang=lang)
					self.server.store.set_setting('connection', config)
					self._json(200, {'saved': True, 'providers': provider_list(lang), 'connection': config})
			except ValueError as error:
				self._error(400, str(error))
			return
		if path == '/api/contribution/verify':
			data = self._body()
			if data is None:
				return
			lang = self._lang(data)
			try:
				verified_status = verify_and_save_contribution(
					self.server.store,
					data.get('signature'),
					lang=lang,
				)
				self._json(200, {'verified': True, 'contribution': verified_status})
			except ValueError as error:
				self._error(400, str(error))
			return
		if match := MISSION_PATH.fullmatch(path):
			if not match[2]:
				self._error(404, 'Route not found.' if en else 'Ruta no encontrada.')
				return
			mission = self.server.runner.cancel(match[1], lang=lang)
			if mission:
				self._json(200, {'mission': mission})
			else:
				self._error(404, 'Mission not found.' if en else 'Misión no encontrada.')
			return
		if path != '/api/missions':
			self._error(404, 'Route not found.' if en else 'Ruta no encontrada.')
			return
		data = self._body()
		if data is None:
			return
		lang = self._lang(data)
		en = lang == 'en'
		task, mode, model = data.get('task'), data.get('mode', 'demo'), data.get('model', '')
		if not isinstance(task, str) or not 3 <= len(task.strip()) <= 4000:
			self._error(
				400,
				'Enter a goal between 3 and 4000 characters.' if en else 'Escribe un objetivo de entre 3 y 4000 caracteres.',
			)
			return
		if mode not in ('demo', 'live') or not isinstance(model, str) or len(model) > 200:
			self._error(400, 'Invalid mode or model.' if en else 'Modo o modelo inválido.')
			return
		config = None
		if mode == 'live':
			saved = self.server.store.get_setting('connection')
			try:
				config = legacy_config(model.strip(), saved, lang=lang) if model.strip() else saved
				if not config:
					raise ValueError(
						'Configure your own connection and an explicit model to run a live mission.'
						if en
						else 'Configura una conexión propia y un modelo explícito para ejecutar una misión real.'
					)
				config = normalize_config(config, lang=lang)
				model = config['model']
			except ValueError as error:
				self._error(400, str(error))
				return
			if not is_contribution_verified(self.server.store):
				self._error(HTTPStatus.PAYMENT_REQUIRED, live_gate_message(lang))
				return
		if self.server.runner.active() >= 3:
			self._error(
				409,
				'Three missions are already running. Wait or cancel one.'
				if en
				else 'Ya hay tres misiones en ejecución. Espera o cancela una.',
			)
			return
		mission = self.server.store.create(task.strip(), mode, model.strip(), config)
		try:
			self.server.runner.submit(mission, lang=lang)
		except MissionLimitError as error:
			self.server.store.delete(mission['id'])
			self._error(409, str(error))
			return
		self._json(201, {'mission': mission})

	def do_DELETE(self) -> None:
		if not self._local_request(mutation=True):
			return
		en = self._lang() == 'en'
		match = MISSION_PATH.fullmatch(urlsplit(self.path).path)
		if not match or match[2]:
			self._error(404, 'Route not found.' if en else 'Ruta no encontrada.')
			return
		mission = self.server.store.get(match[1])
		if not mission:
			self._error(404, 'Mission not found.' if en else 'Misión no encontrada.')
		elif mission['status'] in ('queued', 'running'):
			self._error(409, 'Cancel the mission before deleting it.' if en else 'Cancela la misión antes de eliminarla.')
		else:
			self.server.store.delete(match[1])
			self._json(200, {'deleted': True})


def main() -> None:
	parser = argparse.ArgumentParser(description='Tabvento · Tu mesa local de misiones del navegador')
	parser.add_argument('--port', type=int, default=8765)
	parser.add_argument(
		'--data-dir', type=Path, default=Path(os.getenv('TABVENTO_DATA_DIR', '~/.local/share/tabvento')).expanduser()
	)
	args = parser.parse_args()
	if not 1 <= args.port <= 65535:
		parser.error('--port debe estar entre 1 y 65535')
	os.environ.setdefault('ANONYMIZED_TELEMETRY', 'false')
	os.environ.setdefault('BH_TELEMETRY', '0')
	# Load credentials without importing the browser engine, if python-dotenv is installed.
	try:
		from dotenv import load_dotenv

		load_dotenv(Path.cwd() / '.env')
	except ImportError:
		pass
	server = TabventoServer(('127.0.0.1', args.port), args.data_dir)
	print(f'Tabvento {__version__} · http://127.0.0.1:{args.port}', flush=True)
	try:
		server.serve_forever()
	except KeyboardInterrupt:
		print('\nCerrando Tabvento…', flush=True)
	finally:
		server.server_close()
