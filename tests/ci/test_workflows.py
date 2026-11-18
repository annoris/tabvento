"""Publication boundaries for the independent Tabvento repository."""

import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
WORKFLOWS = ROOT / '.github' / 'workflows'


def workflow():
	return yaml.safe_load((WORKFLOWS / 'ci.yml').read_text())


def test_ci_validates_without_external_publication_or_provider_secrets():
	files = sorted(WORKFLOWS.iterdir())
	assert [f.name for f in files] == ['ci.yml']
	text = files[0].read_text()
	ci = workflow()
	assert set(ci['on']) == {'push', 'pull_request', 'workflow_dispatch'}
	assert ci['permissions'] == {'contents': 'read'}
	assert ci['env']['ANONYMIZED_TELEMETRY'] == 'false'
	assert ci['env']['BH_TELEMETRY'] == '0'
	assert 'secrets.' not in text
	for action in re.findall(r'uses:\s*(\S+)', text):
		assert re.fullmatch(r'[\w.-]+/[\w./-]+@[0-9a-f]{40}', action), action
		assert not any(name in action for name in ('publish', 'login', 'release'))
	runs = '\n'.join(step.get('run', '') for job in ci['jobs'].values() for step in job['steps'])
	for command in ('uv publish', 'docker push', 'gh release', 'npm publish', 'curl '):
		assert command not in runs


def test_ci_checks_tabvento_and_uses_locked_dependencies():
	ci = workflow()
	assert {'python', 'frontend', 'chrome'} == set(ci['jobs'])
	python_steps = ci['jobs']['python']['steps']
	commands = '\n'.join(s.get('run', '') for s in python_steps)
	for expected in ('uv sync --locked', 'pytest tests -m "not chrome"', 'ruff check --no-fix', 'pyright', 'uv build'):
		assert expected in commands
	frontend_commands = '\n'.join(s.get('run', '') for s in ci['jobs']['frontend']['steps'])
	assert 'npm ci --prefix tests/frontend' in frontend_commands
	assert 'npm test --prefix tests/frontend' in frontend_commands
	chrome_commands = '\n'.join(s.get('run', '') for s in ci['jobs']['chrome']['steps'])
	assert 'google-chrome not found' in chrome_commands
	assert 'pytest tests -m chrome' in chrome_commands


def test_project_metadata_names_tabvento_and_preserves_licenses():
	import tomllib

	project = tomllib.loads((ROOT / 'pyproject.toml').read_text())['project']
	assert project['name'] == 'tabvento'
	assert project['license'] == 'MIT'
	assert not project.get('urls')
	assert 'Copyright (c) 2026 Tabvento' in (ROOT / 'LICENSE').read_text()
	assert (ROOT / 'THIRD_PARTY_NOTICES.md').is_file()
