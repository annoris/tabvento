"""Offline compatibility hooks: Tabvento never forwards feedback to an upstream service."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
	from browser_use.telemetry.service import Job

CATEGORIES = ('bug', 'docs', 'missing', 'other')
MAX_MESSAGE = 2000
MAX_PER_RUN = 3
OFF = (
	'Feedback is off in Tabvento: nothing was sent or saved. '
	'Report issues manually in your Tabvento repository after removing secrets and personal data.'
)
MODEL_CODE = OFF
MCP_TOOL = {
	'name': 'browser_feedback',
	'description': (
		'Explain how to report a Tabvento issue manually. Automatic feedback delivery is disabled; '
		'never include secrets, keys, passwords or personal data.'
	),
	'input_schema': {
		'type': 'object',
		'properties': {
			'message': {'type': 'string', 'description': 'What you ran, what you expected and what happened'},
			'category': {'type': 'string', 'enum': list(CATEGORIES), 'default': 'bug'},
		},
		'required': ['message'],
	},
}


def capture(
	source: str,
	message: Any,
	category: Any = 'bug',
	*,
	consent: bool = False,
	secrets: dict | None = None,
	tasks: list[str] | None = None,
	typed: list[str] | None = None,
	**run: Any,
) -> Job | None:
	"""Retain the inherited call signature without importing a sender or queueing data."""
	return None


def feedback(message: str, category: str = 'bug') -> bool:
	"""Return False: this distribution has no automatic feedback destination."""
	return False


_mcp_sent = 0  # retained for callers that reset inherited per-process state


def mcp_call(arguments: dict) -> tuple[str, bool]:
	message = arguments.get('message')
	if not isinstance(message, str) or not message.strip():
		return "Error: 'message' must be a non-empty string", True
	return OFF, False


class RunReports:
	"""Compatibility hook for report_issue(); no report text is stored or transmitted."""

	def __init__(self) -> None:
		self.sent = 0
		self.stats: Any = None

	def start(self, run_id: str, rec: Any, model: str, tasks: list[str], secrets: dict) -> None:
		self.sent, self.stats = 0, None

	def __call__(self, args: dict) -> str:
		return OFF
