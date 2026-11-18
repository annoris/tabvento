"""Tabvento's direct provider registry. Settings contain no credentials and checks make no network calls."""

from __future__ import annotations

import importlib.util
import os
import shutil
from pathlib import Path
from typing import Any, TypedDict
from urllib.parse import urlsplit


class ProviderDetails(TypedDict):
	label: str
	key_env: str | None


PROVIDERS: dict[str, ProviderDetails] = {
	'openai': {'label': 'OpenAI', 'key_env': 'OPENAI_API_KEY'},
	'anthropic': {'label': 'Anthropic', 'key_env': 'ANTHROPIC_API_KEY'},
	'google': {'label': 'Google Gemini', 'key_env': 'GOOGLE_API_KEY'},
	'ollama': {'label': 'Ollama local', 'key_env': None},
	'compatible': {'label': 'API compatible con OpenAI', 'key_env': 'TABVENTO_COMPATIBLE_API_KEY'},
}
PROVIDER_LABELS_EN = {
	'openai': 'OpenAI',
	'anthropic': 'Anthropic',
	'google': 'Google Gemini',
	'ollama': 'Local Ollama',
	'compatible': 'OpenAI-compatible API',
}
LOCAL_HOSTS = {'127.0.0.1', 'localhost', '::1'}


def _is_en(lang: str | None) -> bool:
	if not isinstance(lang, str) or not lang.strip():
		return True
	return not lang.strip().lower().startswith('es')


def _provider_label(provider: str, lang: str = 'en') -> str:
	if _is_en(lang):
		return PROVIDER_LABELS_EN.get(provider, PROVIDERS[provider]['label'])
	return PROVIDERS[provider]['label']


def credential(provider: str) -> str:
	if provider == 'google':
		return os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY') or ''
	name = PROVIDERS[provider]['key_env']
	return os.getenv(name, '') if name else ''


def provider_list(lang: str = 'en') -> list[dict]:
	return [
		{
			'id': provider,
			**details,
			'label': _provider_label(provider, lang),
			'credential_present': bool(credential(provider)),
			'requires_key': provider != 'ollama',
		}
		for provider, details in PROVIDERS.items()
	]


def normalize_config(data: dict, lang: str = 'en') -> dict[str, str]:
	en = _is_en(lang)
	if set(data) - {'provider', 'model', 'base_url'}:
		raise ValueError(
			'Connection only accepts provider, model, and base_url. Store keys in environment variables.'
			if en
			else 'La conexión solo admite provider, model y base_url. Guarda las claves en variables de entorno.'
		)
	provider, model, base_url = data.get('provider'), data.get('model'), data.get('base_url', '')
	if not isinstance(provider, str) or provider not in PROVIDERS:
		raise ValueError('Select a direct Tabvento provider.' if en else 'Selecciona un proveedor directo de Tabvento.')
	if not isinstance(model, str) or not 1 <= len(model.strip()) <= 200:
		raise ValueError(
			'Enter the exact model identifier, up to 200 characters.'
			if en
			else 'Escribe el identificador exacto del modelo, de hasta 200 caracteres.'
		)
	if not isinstance(base_url, str) or len(base_url) > 1000:
		raise ValueError('The server URL is invalid.' if en else 'La URL del servidor no es válida.')
	base_url = base_url.strip().rstrip('/')
	if provider == 'ollama' and not base_url:
		base_url = 'http://127.0.0.1:11434/v1'
	if provider in ('compatible', 'ollama'):
		try:
			url = urlsplit(base_url)
			valid = url.scheme in ('http', 'https') and bool(url.hostname) and url.port != 0
		except ValueError:
			valid = False
		if not valid or url.username or url.password or url.query or url.fragment:
			raise ValueError(
				'Use an HTTP(S) URL without credentials, query, or fragments; for example http://127.0.0.1:11434/v1.'
				if en
				else 'Usa una URL HTTP(S) sin credenciales, consulta ni fragmentos; por ejemplo http://127.0.0.1:11434/v1.'
			)
		if provider == 'ollama' and url.hostname not in LOCAL_HOSTS:
			raise ValueError(
				'Local Ollama connection requires localhost or a loopback address. For another server, use OpenAI-compatible API.'
				if en
				else 'La conexión Ollama local requiere localhost o una dirección loopback. Para otro servidor usa API compatible.'
			)
		if (url.hostname or '').endswith(('browser-use.com', 'browser-use.tools')):
			raise ValueError(
				'Tabvento uses direct connections; configure your own compatible server.'
				if en
				else 'Tabvento usa conexiones directas; configura tu propio servidor compatible.'
			)
	elif base_url:
		raise ValueError(
			'Custom URL is only for the OpenAI-compatible API provider.'
			if en
			else 'La URL personalizada corresponde al proveedor API compatible.'
		)
	return {'provider': provider, 'model': model.strip(), 'base_url': base_url}


def legacy_config(model: str, saved: dict | None = None, lang: str = 'en') -> dict[str, str]:
	"""Interpret known provider prefixes while retaining unfamiliar model names exactly."""
	provider, separator, name = model.partition(':')
	if separator and provider in ('openai', 'anthropic', 'google'):
		return normalize_config({'provider': provider, 'model': name}, lang=lang)
	if saved:
		return normalize_config({**saved, 'model': model}, lang=lang)
	return normalize_config({'provider': 'openai', 'model': model}, lang=lang)


def engine_available() -> bool:
	return all(importlib.util.find_spec(name) is not None for name in ('pydantic_ai', 'browser_harness', 'pydantic'))


def local_browser_available() -> bool:
	return bool(
		any(shutil.which(name) for name in ('google-chrome', 'chromium', 'chromium-browser', 'chrome', 'msedge'))
		or any(
			Path(path).expanduser().is_file()
			for path in (
				os.getenv('BH_CHROME_PATH', ''),
				'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
				'/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
				'/Applications/Chromium.app/Contents/MacOS/Chromium',
				os.path.join(os.getenv('PROGRAMFILES', ''), 'Google/Chrome/Application/chrome.exe'),
				os.path.join(os.getenv('PROGRAMFILES(X86)', ''), 'Microsoft/Edge/Application/msedge.exe'),
			)
		)
	)


def check_config(config: dict | None, lang: str = 'en') -> dict:
	en = _is_en(lang)
	checks = []
	if config:
		config = normalize_config(config, lang=lang)
		provider = config['provider']
		local = urlsplit(config['base_url']).hostname in LOCAL_HOSTS
		needs_key = provider != 'ollama' and not (provider == 'compatible' and local)
		checks.append(
			{
				'id': 'configuration',
				'label': 'Provider and model' if en else 'Proveedor y modelo',
				'ok': True,
				'detail': f'{_provider_label(provider, lang)} · {config["model"]}',
			}
		)
		checks.append(
			{
				'id': 'credential',
				'label': 'Credential in environment' if en else 'Credencial en el entorno',
				'ok': not needs_key or bool(credential(provider)),
				'detail': ('No key required for this local server.' if en else 'No se necesita clave para este servidor local.')
				if not needs_key
				else (
					f'Required variable: {PROVIDERS[provider]["key_env"]}.'
					if en
					else f'Variable requerida: {PROVIDERS[provider]["key_env"]}.'
				),
			}
		)
	else:
		checks.append(
			{
				'id': 'configuration',
				'label': 'Provider and model' if en else 'Proveedor y modelo',
				'ok': False,
				'detail': 'Save a connection before running a live mission.'
				if en
				else 'Guarda una conexión antes de ejecutar una misión real.',
			}
		)
	checks.extend(
		[
			{
				'id': 'engine',
				'label': 'Engine dependencies' if en else 'Dependencias del motor',
				'ok': engine_available(),
				'detail': 'Local check of installed modules.' if en else 'Comprobación local de los módulos instalados.',
			},
			{
				'id': 'browser',
				'label': 'Local browser' if en else 'Navegador local',
				'ok': local_browser_available(),
				'detail': 'Detection of Chrome, Chromium, or Edge in standard paths; does not open the browser.'
				if en
				else 'Detección de Chrome, Chromium o Edge en rutas habituales; no abre el navegador.',
			},
		]
	)
	return {
		'ok': all(check['ok'] for check in checks),
		'scope': 'configuration',
		'authentication_verified': False,
		'checks': checks,
		'message': (
			'Only local configuration was checked. The provider was not authenticated and the model server was not contacted.'
			if en
			else 'Solo se comprobó la configuración local. No se autenticó el proveedor ni se contactó con el servidor del modelo.'
		),
	}


def build_model(config: dict, lang: str = 'en') -> Any:
	"""Build an explicit direct adapter; never fall back to a hosted Browser Use model."""
	en = _is_en(lang)
	config = normalize_config(config, lang=lang)
	provider, model = config['provider'], config['model']
	key = credential(provider)
	if provider in ('ollama', 'compatible'):
		from pydantic_ai.models.openai import OpenAIChatModel
		from pydantic_ai.profiles.openai import OpenAIModelProfile
		from pydantic_ai.providers.openai import OpenAIProvider

		local = urlsplit(config['base_url']).hostname in LOCAL_HOSTS
		if not key and not local:
			raise ValueError(
				'Missing TABVENTO_COMPATIBLE_API_KEY for your remote server.'
				if en
				else 'Falta TABVENTO_COMPATIBLE_API_KEY para tu servidor remoto.'
			)
		return OpenAIChatModel(
			model,
			provider=OpenAIProvider(base_url=config['base_url'], api_key=key or 'tabvento-local'),
			profile=OpenAIModelProfile(openai_chat_supports_allowed_tools=False, openai_supports_strict_tool_definition=False),
		)
	if not key:
		raise ValueError(
			f'Missing {PROVIDERS[provider]["key_env"]}. Set the key in the environment or .env and restart Tabvento.'
			if en
			else f'Falta {PROVIDERS[provider]["key_env"]}. Configura la clave en el entorno o en .env y reinicia Tabvento.'
		)
	if provider == 'openai':
		from pydantic_ai.models.openai import OpenAIResponsesModel
		from pydantic_ai.providers.openai import OpenAIProvider

		return OpenAIResponsesModel(model, provider=OpenAIProvider(api_key=key, base_url='https://api.openai.com/v1'))
	if provider == 'anthropic':
		from pydantic_ai.models.anthropic import AnthropicModel
		from pydantic_ai.providers.anthropic import AnthropicProvider

		return AnthropicModel(model, provider=AnthropicProvider(api_key=key, base_url='https://api.anthropic.com'))
	from pydantic_ai.models.google import GoogleModel
	from pydantic_ai.providers.google import GoogleProvider

	return GoogleModel(model, provider=GoogleProvider(api_key=key, base_url='https://generativelanguage.googleapis.com'))
