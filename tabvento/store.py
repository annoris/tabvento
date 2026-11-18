"""SQLite storage for local missions. One connection per operation keeps HTTP threads isolated."""

from __future__ import annotations

import json
import sqlite3
import uuid
from collections.abc import Iterator
from contextlib import contextmanager
from datetime import UTC, datetime
from pathlib import Path


def timestamp() -> str:
	return datetime.now(UTC).isoformat()


class MissionStore:
	def __init__(self, path: Path):
		self.path = path
		path.parent.mkdir(parents=True, exist_ok=True)
		with self.connect() as connection:
			connection.execute('CREATE TABLE IF NOT EXISTS missions (id TEXT PRIMARY KEY, data TEXT NOT NULL)')
			connection.execute('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)')

	def get_setting(self, key: str) -> dict | None:
		with self.connect() as connection:
			row = connection.execute('SELECT value FROM settings WHERE key = ?', (key,)).fetchone()
		return json.loads(row[0]) if row else None

	def set_setting(self, key: str, value: dict) -> None:
		with self.connect() as connection:
			connection.execute('INSERT OR REPLACE INTO settings VALUES (?, ?)', (key, json.dumps(value, ensure_ascii=False)))

	@contextmanager
	def connect(self) -> Iterator[sqlite3.Connection]:
		connection = sqlite3.connect(self.path, timeout=10)
		try:
			with connection:
				yield connection
		finally:
			# sqlite3's own context manager commits/rolls back, but does not close the handle.
			connection.close()

	def recover(self) -> None:
		"""A restarted server cannot resume an old Python worker or browser session."""
		for mission in self.list():
			if mission['status'] in ('queued', 'running'):
				self.update(mission['id'], status='failed', error='The server restarted before this mission finished.')

	def create(self, task: str, mode: str, model: str, connection_config: dict | None = None) -> dict:
		now = timestamp()
		mission = {
			'id': uuid.uuid4().hex,
			'task': task,
			'mode': mode,
			'model': model,
			'status': 'queued',
			'created_at': now,
			'updated_at': now,
			'steps': [],
			'result': None,
			'error': None,
		}
		if connection_config is not None:
			mission['connection'] = connection_config
		with self.connect() as connection:
			connection.execute('INSERT INTO missions VALUES (?, ?)', (mission['id'], json.dumps(mission, ensure_ascii=False)))
		return mission

	def get(self, mission_id: str) -> dict | None:
		with self.connect() as connection:
			row = connection.execute('SELECT data FROM missions WHERE id = ?', (mission_id,)).fetchone()
		return json.loads(row[0]) if row else None

	def list(self) -> list[dict]:
		with self.connect() as connection:
			rows = connection.execute('SELECT data FROM missions ORDER BY rowid DESC').fetchall()
		return [json.loads(row[0]) for row in rows]

	def update(self, mission_id: str, *, step: str | None = None, **fields) -> dict | None:
		with self.connect() as connection:
			connection.execute('BEGIN IMMEDIATE')
			row = connection.execute('SELECT data FROM missions WHERE id = ?', (mission_id,)).fetchone()
			if not row:
				return None
			mission = json.loads(row[0])
			# Completion, cancellation and failure compete between HTTP and worker threads.
			# The first terminal state committed wins; late events cannot rewrite its result.
			if mission['status'] in ('completed', 'failed', 'cancelled'):
				return mission
			mission.update(fields)
			mission['updated_at'] = timestamp()
			if step:
				mission['steps'].append({'label': step, 'at': mission['updated_at']})
			connection.execute('UPDATE missions SET data = ? WHERE id = ?', (json.dumps(mission, ensure_ascii=False), mission_id))
		return mission

	def delete(self, mission_id: str) -> bool:
		with self.connect() as connection:
			return connection.execute('DELETE FROM missions WHERE id = ?', (mission_id,)).rowcount > 0
