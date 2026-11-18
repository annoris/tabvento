"""Background mission execution. Demo mode never imports the engine or contacts a provider."""

from __future__ import annotations

import asyncio
import os
import threading
from pathlib import Path

from tabvento.connections import build_model, legacy_config
from tabvento.solana_gate import is_contribution_verified, live_gate_message
from tabvento.store import MissionStore


def _is_en(lang: str | None) -> bool:
	if not isinstance(lang, str) or not lang.strip():
		return True
	return not lang.strip().lower().startswith('es')


def redact_error(error: object, lang: str = 'en') -> str:
	en = _is_en(lang)
	message = str(error) or type(error).__name__
	secrets = {
		value
		for name in (
			'OPENAI_API_KEY',
			'ANTHROPIC_API_KEY',
			'GOOGLE_API_KEY',
			'GEMINI_API_KEY',
			'BROWSER_USE_API_KEY',
			'AZURE_OPENAI_API_KEY',
			'TABVENTO_COMPATIBLE_API_KEY',
		)
		if (value := os.getenv(name))
	}
	token = '[redacted credential]' if en else '[credencial oculta]'
	for secret in sorted(secrets, key=len, reverse=True):
		message = message.replace(secret, token)
	# Truncation before redaction could leave an exposed prefix of a key at the boundary.
	return message[:1200]


class MissionLimitError(RuntimeError):
	"""Admission was rejected without starting another worker."""


class MissionRunner:
	def __init__(self, store: MissionStore, workspace: Path, demo_delay: float = 0.7):
		self.store = store
		self.workspace = workspace
		self.demo_delay = demo_delay
		self._lock = threading.Lock()
		self._workers: dict[str, tuple[threading.Thread, threading.Event]] = {}
		self._tasks: dict[str, tuple[asyncio.AbstractEventLoop, asyncio.Task]] = {}
		self._langs: dict[str, str] = {}
		self._closing = False

	def _mission_lang(self, mission: dict) -> str:
		lang = self._langs.get(mission['id']) or mission.get('lang', 'en')
		return 'en' if _is_en(lang) else 'es'

	def submit(self, mission: dict, lang: str = 'en') -> None:
		effective_lang = 'es' if (not _is_en(lang) or (mission.get('lang') and not _is_en(mission.get('lang')))) else 'en'
		en = effective_lang == 'en'
		with self._lock:
			if self._closing:
				raise MissionLimitError('The server is shutting down.' if en else 'El servidor se está cerrando.')
			if len(self._workers) >= 3:
				raise MissionLimitError(
					'Three missions are already running. Wait or cancel one.'
					if en
					else 'Ya hay tres misiones en ejecución. Espera o cancela una.'
				)
			event = threading.Event()
			self._langs[mission['id']] = effective_lang
			thread = threading.Thread(
				target=self._run,
				args=(mission, event),
				daemon=True,
				name=f'tabvento-{mission["id"][:8]}',
			)
			self._workers[mission['id']] = (thread, event)
			thread.start()

	def cancel(self, mission_id: str, lang: str = 'en') -> dict | None:
		stored_lang = self._langs.get(mission_id)
		en = _is_en(stored_lang) if stored_lang else _is_en(lang)
		mission = self.store.get(mission_id)
		if not mission or mission['status'] not in ('queued', 'running'):
			return mission
		with self._lock:
			worker = self._workers.get(mission_id)
			if worker:
				worker[1].set()
			running = self._tasks.get(mission_id)
			if running:
				try:
					running[0].call_soon_threadsafe(running[1].cancel)
				except RuntimeError:
					pass
		return self.store.update(
			mission_id,
			status='cancelled',
			step=(
				'Cancellation requested; closing local execution.'
				if en
				else 'Cancelación solicitada; cerrando la ejecución local.'
			),
		)

	def active(self) -> int:
		with self._lock:
			return len(self._workers)

	def close(self) -> None:
		with self._lock:
			self._closing = True
			workers = list(self._workers.items())
		for mission_id, _ in workers:
			self.cancel(mission_id)
		for _, (thread, _) in workers:
			thread.join(timeout=3)

	def _run(self, mission: dict, cancelled: threading.Event) -> None:
		lang = self._mission_lang(mission)
		en = lang == 'en'
		mission_id = mission['id']
		try:
			if cancelled.is_set():
				return
			if mission['mode'] == 'demo':
				step = 'Simulated demo started.' if en else 'Demostración simulada iniciada.'
			else:
				step = 'Starting engine and local browser.' if en else 'Iniciando motor y navegador local.'
			self.store.update(
				mission_id,
				status='running',
				step=step,
			)
			if mission['mode'] == 'demo':
				self._demo(mission, cancelled)
			else:
				asyncio.run(self._live(mission, cancelled))
		except asyncio.CancelledError:
			self.store.update(mission_id, status='cancelled')
		except Exception as error:
			# Provider exception messages can contain URLs or keys. Persist a bounded, redacted diagnostic.
			message = redact_error(error, lang=lang)
			self.store.update(
				mission_id,
				status='failed',
				error=message,
				step='The mission could not be completed.' if en else 'La misión no pudo completarse.',
			)
		finally:
			with self._lock:
				self._tasks.pop(mission_id, None)
				self._workers.pop(mission_id, None)
				self._langs.pop(mission_id, None)

	def _demo(self, mission: dict, cancelled: threading.Event) -> None:
		lang = self._mission_lang(mission)
		en = lang == 'en'
		steps = (
			(
				'Interpreting sample goal.',
				'Organizing three demo tabs.',
				'Connecting steps into a workflow.',
				'Preparing simulated result.',
			)
			if en
			else (
				'Interpretando el objetivo de ejemplo.',
				'Organizando tres pestañas de demostración.',
				'Conectando los pasos en una ruta de trabajo.',
				'Preparando el resultado simulado.',
			)
		)
		for label in steps:
			if cancelled.wait(self.demo_delay):
				return
			self.store.update(mission['id'], step=label)
		if cancelled.is_set():
			return
		if en:
			result = (
				'SIMULATED DEMO — no pages were visited and no AI was queried.\n\n'
				f'Goal received: {mission["task"]}\n\n'
				'Sample workflow:\n'
				'1. Identify the sources needed for the goal.\n'
				'2. Open and review the relevant pages.\n'
				'3. Cross-check the information and organize a result.\n\n'
				'This demo lets you test history, statuses, and cancellation without credentials or costs. '
				'For real data, configure a provider and create a mission in live mode.'
			)
		else:
			result = (
				'DEMOSTRACIÓN SIMULADA — no se han visitado páginas ni consultado una IA.\n\n'
				f'Objetivo recibido: {mission["task"]}\n\n'
				'Ruta de trabajo de ejemplo:\n'
				'1. Identificar las fuentes necesarias para el objetivo.\n'
				'2. Abrir y revisar las páginas relevantes.\n'
				'3. Contrastar la información y organizar un resultado.\n\n'
				'Esta demo permite probar el historial, los estados y la cancelación sin credenciales ni costes. '
				'Para obtener datos reales, configura un proveedor y crea una misión en modo real.'
			)
		self.store.update(
			mission['id'],
			status='completed',
			result=result,
			step='Demo completed.' if en else 'Demostración finalizada.',
		)

	async def _live(self, mission: dict, cancelled: threading.Event) -> None:
		lang = self._mission_lang(mission)
		en = lang == 'en'
		if not is_contribution_verified(self.store):
			raise RuntimeError(live_gate_message(lang))
		# Tabvento never sends inherited engine or browser-harness usage telemetry,
		# even if a shell profile enabled it for another application.
		os.environ['ANONYMIZED_TELEMETRY'] = 'false'
		os.environ['BH_TELEMETRY'] = '0'
		# These imports are deliberately lazy: the web application and demo also work without engine dependencies.
		from browser_use import Agent, Browser

		loop, task = asyncio.get_running_loop(), asyncio.current_task()
		assert task is not None
		with self._lock:
			self._tasks[mission['id']] = (loop, task)
		if cancelled.is_set():
			return
		browser = Browser('chromium')
		config = mission.get('connection') or legacy_config(mission['model'], lang=lang)
		model = build_model(config, lang=lang) if en else build_model(config)
		agent = Agent(mission['task'], llm=model, browser=browser, workspace=self.workspace / mission['id'], web_search=False)
		try:
			self.store.update(
				mission['id'],
				step=(
					'Running mission with the configured provider; awaiting result.'
					if en
					else 'Ejecutando la misión con el proveedor configurado; esperando su resultado.'
				),
			)
			result = await agent.run(max_steps=40, timeout=300)
			text = result.final_result()
			if result.status != 'completed' or result.is_successful() is False:
				fallback_err = (
					'The agent finished without completing the goal.' if en else 'El agente terminó sin completar el objetivo.'
				)
				self.store.update(
					mission['id'],
					status='failed',
					result=text or str(result.partial or '') or None,
					error=redact_error(result.error or fallback_err, lang=lang),
					step=(
						'Execution finished with an incomplete result.'
						if en
						else 'Ejecución finalizada con un resultado incompleto.'
					),
				)
			else:
				self.store.update(
					mission['id'],
					status='completed',
					result=text or '',
					step='Result received from the agent.' if en else 'Resultado recibido del agente.',
				)
		finally:
			await agent.close()
