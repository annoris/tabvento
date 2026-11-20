"""Solana contribution verification and live-mission gate for Tabvento."""

from __future__ import annotations

import hashlib
import json
import os
import re
import urllib.error
import urllib.request
from pathlib import Path

from tabvento.store import MissionStore, timestamp

SOLANA_WALLET = '3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm'
MIN_CONTRIBUTION_USD = 88
MAX_CONTRIBUTION_USD: int | None = None
DEFAULT_SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com'
USDC_MINT_MAINNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
USDT_MINT_MAINNET = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
LAMPORTS_PER_SOL = 1_000_000_000
DEFAULT_SOL_USD_PRICE = 176.0
SOL_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
BASE58_SIGNATURE = re.compile(r'^[1-9A-HJ-NP-Za-km-z]{64,90}$')
MEMO_PROGRAM_IDS = frozenset(
	{
		'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
		'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo',
	}
)
MEMO_LOG_PATTERN = re.compile(r'^Program log:\s*Memo(?:\s*\(len\s+\d+\))?:\s*"?(.*?)"?\s*$')


def device_code_for_path(path: Path) -> str:
	digest = hashlib.sha256(str(path.resolve()).encode('utf-8')).hexdigest()[:12].upper()
	return f'TV-{digest}'


def device_code_for_store(store: MissionStore) -> str:
	saved = store.get_setting('contribution')
	if isinstance(saved, dict):
		existing = saved.get('device_code')
		if isinstance(existing, str) and existing.startswith('TV-') and len(existing) == 15:
			return existing
	return device_code_for_path(store.path)


def solana_pay_url(device_code: str) -> str:
	return f'solana:{SOLANA_WALLET}?label=Tabvento&memo={device_code}'


def is_contribution_verified(store: MissionStore) -> bool:
	saved = store.get_setting('contribution')
	return bool(
		isinstance(saved, dict)
		and saved.get('verified') is True
		and saved.get('wallet') == SOLANA_WALLET
		and isinstance(saved.get('tx_signature'), str)
		and float(saved.get('amount_usd', 0)) >= MIN_CONTRIBUTION_USD
	)


def contribution_status(store: MissionStore) -> dict:
	code = device_code_for_store(store)
	saved = store.get_setting('contribution') or {}
	verified = is_contribution_verified(store)
	return {
		'wallet': SOLANA_WALLET,
		'min_contribution_usd': MIN_CONTRIBUTION_USD,
		'max_contribution_usd': MAX_CONTRIBUTION_USD,
		'device_code': code,
		'solana_pay_url': solana_pay_url(code),
		'verified': verified,
		'tx_signature': saved.get('tx_signature') if verified else None,
		'amount_usd': saved.get('amount_usd') if verified else None,
		'currency': saved.get('currency') if verified else None,
		'verified_at': saved.get('verified_at') if verified else None,
	}


def live_gate_message(lang: str = 'en') -> str:
	if not lang.strip().lower().startswith('es'):
		return (
			f'Live browser missions require a verified Solana contribution (minimum ${MIN_CONTRIBUTION_USD} USD '
			f'in SOL or USDC, no maximum limit) to {SOLANA_WALLET}. Simulated demo mode is free.'
		)
	return (
		f'Las misiones en navegador real requieren una contribución verificada en Solana (mínimo ${MIN_CONTRIBUTION_USD} USD '
		f'en SOL o USDC, sin límite máximo) a {SOLANA_WALLET}. El modo Demo simulada es gratuito.'
	)


def validate_signature_format(signature: object, *, lang: str = 'en') -> str:
	en = not lang.strip().lower().startswith('es')
	if not isinstance(signature, str) or not BASE58_SIGNATURE.fullmatch(signature.strip()):
		raise ValueError(
			'Enter a valid Base58 Solana transaction signature (64–90 characters).'
			if en
			else 'Introduce una firma de transacción de Solana válida en Base58 (64–90 caracteres).'
		)
	return signature.strip()


def _sol_usd_price() -> float:
	raw = os.getenv('TABVENTO_SOL_USD_PRICE', '').strip()
	if raw:
		try:
			val = float(raw)
			if val > 0:
				return val
		except ValueError:
			pass
	price_url = os.getenv('TABVENTO_SOL_PRICE_URL', SOL_PRICE_URL).strip() or SOL_PRICE_URL
	try:
		request = urllib.request.Request(price_url, headers={'Accept': 'application/json'})
		with urllib.request.urlopen(request, timeout=3) as response:
			data = json.loads(response.read().decode('utf-8'))
		if isinstance(data, dict):
			solana = data.get('solana')
			if isinstance(solana, dict):
				val = float(solana.get('usd', 0))
				if val > 0:
					return val
	except (urllib.error.URLError, TimeoutError, ValueError, TypeError):
		pass
	return DEFAULT_SOL_USD_PRICE


def _parse_token_amount(entry: dict) -> float:
	ui_token = entry.get('uiTokenAmount')
	if not isinstance(ui_token, dict):
		return 0.0
	ui_amount = ui_token.get('uiAmount')
	if isinstance(ui_amount, (int, float)):
		return float(ui_amount)
	ui_str = ui_token.get('uiAmountString')
	if isinstance(ui_str, str):
		try:
			return float(ui_str)
		except ValueError:
			pass
	raw_amount = ui_token.get('amount')
	decimals = ui_token.get('decimals', 0)
	if isinstance(raw_amount, str) and isinstance(decimals, int):
		try:
			return int(raw_amount) / (10**decimals)
		except ValueError:
			pass
	return 0.0


def _token_totals_for_owner(entries: object, owner: str) -> dict[str, float]:
	totals: dict[str, float] = {}
	if not isinstance(entries, list):
		return totals
	for item in entries:
		if not isinstance(item, dict):
			continue
		if item.get('owner') != owner:
			continue
		mint = item.get('mint')
		if not isinstance(mint, str):
			continue
		totals[mint] = totals.get(mint, 0.0) + _parse_token_amount(item)
	return totals


def _extract_pubkeys(result: dict) -> list[str]:
	tx = result.get('transaction')
	if not isinstance(tx, dict):
		return []
	message = tx.get('message')
	if not isinstance(message, dict):
		return []
	keys = message.get('accountKeys')
	if not isinstance(keys, list):
		return []
	pubkeys: list[str] = []
	for key in keys:
		if isinstance(key, str):
			pubkeys.append(key)
		elif isinstance(key, dict) and isinstance(key.get('pubkey'), str):
			pubkeys.append(key['pubkey'])
	return pubkeys


def _collect_instruction_memos(instructions: object, memos: list[str]) -> None:
	if not isinstance(instructions, list):
		return
	for ix in instructions:
		if not isinstance(ix, dict):
			continue
		program = ix.get('program')
		program_id = ix.get('programId')
		if program == 'spl-memo' or program_id in MEMO_PROGRAM_IDS:
			parsed = ix.get('parsed')
			if isinstance(parsed, str) and parsed.strip():
				memos.append(parsed.strip())


def _extract_memos(result: dict, meta: dict) -> list[str]:
	memos: list[str] = []
	tx = result.get('transaction')
	if isinstance(tx, dict):
		message = tx.get('message')
		if isinstance(message, dict):
			_collect_instruction_memos(message.get('instructions'), memos)
	inner = meta.get('innerInstructions')
	if isinstance(inner, list):
		for group in inner:
			if isinstance(group, dict):
				_collect_instruction_memos(group.get('instructions'), memos)
	logs = meta.get('logMessages')
	if isinstance(logs, list):
		for line in logs:
			if not isinstance(line, str):
				continue
			match = MEMO_LOG_PATTERN.match(line.strip())
			if match and match.group(1).strip():
				memos.append(match.group(1).strip())
	return memos


def _verify_via_remote_validator(
	validator_url: str,
	signature: str,
	*,
	expected_memo: str | None = None,
	lang: str = 'en',
) -> dict:
	en = not lang.strip().lower().startswith('es')
	payload = json.dumps(
		{
			'signature': signature,
			'wallet': SOLANA_WALLET,
			'min_usd': MIN_CONTRIBUTION_USD,
			'memo': expected_memo,
		}
	).encode('utf-8')
	request = urllib.request.Request(
		validator_url,
		data=payload,
		headers={'Content-Type': 'application/json', 'Accept': 'application/json'},
		method='POST',
	)
	try:
		with urllib.request.urlopen(request, timeout=10) as response:
			data = json.loads(response.read().decode('utf-8'))
	except (urllib.error.URLError, TimeoutError, ValueError) as error:
		raise ValueError(
			'Could not reach the Solana contribution validator. Check your network and try again.'
			if en
			else 'No se pudo conectar con el validador de contribución de Solana. Comprueba tu conexión e inténtalo de nuevo.'
		) from error
	if not isinstance(data, dict) or not data.get('verified'):
		detail = data.get('error') if isinstance(data, dict) else None
		if isinstance(detail, str) and detail.strip():
			raise ValueError(detail.strip())
		raise ValueError(
			f'Contribution verification failed. Minimum required: ${MIN_CONTRIBUTION_USD} USD (no maximum limit).'
			if en
			else f'La verificación de la contribución falló. Mínimo requerido: ${MIN_CONTRIBUTION_USD} USD (sin límite máximo).'
		)
	amount_usd = float(data.get('amount_usd', MIN_CONTRIBUTION_USD))
	if amount_usd + 1e-6 < MIN_CONTRIBUTION_USD:
		raise ValueError(
			f'Minimum contribution is ${MIN_CONTRIBUTION_USD} USD in SOL or USDC (no maximum limit). Detected: ${amount_usd:.2f} USD.'
			if en
			else f'La contribución mínima es de ${MIN_CONTRIBUTION_USD} USD en SOL o USDC (sin límite máximo). Detectado: ${amount_usd:.2f} USD.'
		)
	return {
		'verified': True,
		'wallet': SOLANA_WALLET,
		'min_contribution_usd': MIN_CONTRIBUTION_USD,
		'max_contribution_usd': MAX_CONTRIBUTION_USD,
		'tx_signature': signature,
		'amount_usd': round(amount_usd, 2),
		'currency': str(data.get('currency', 'SOL')),
		'verified_at': timestamp(),
	}


def verify_solana_transaction(
	signature: object,
	*,
	expected_memo: str | None = None,
	lang: str = 'en',
) -> dict:
	en = not lang.strip().lower().startswith('es')
	cleaned = validate_signature_format(signature, lang=lang)
	validator_url = os.getenv('TABVENTO_VALIDATOR_URL', '').strip()
	if validator_url:
		return _verify_via_remote_validator(validator_url, cleaned, expected_memo=expected_memo, lang=lang)

	rpc_url = os.getenv('TABVENTO_SOLANA_RPC_URL', DEFAULT_SOLANA_RPC_URL).strip() or DEFAULT_SOLANA_RPC_URL
	rpc_body = json.dumps(
		{
			'jsonrpc': '2.0',
			'id': 1,
			'method': 'getTransaction',
			'params': [
				cleaned,
				{
					'encoding': 'jsonParsed',
					'commitment': 'confirmed',
					'maxSupportedTransactionVersion': 0,
				},
			],
		}
	).encode('utf-8')
	request = urllib.request.Request(
		rpc_url,
		data=rpc_body,
		headers={'Content-Type': 'application/json', 'Accept': 'application/json'},
		method='POST',
	)
	try:
		with urllib.request.urlopen(request, timeout=10) as response:
			payload = json.loads(response.read().decode('utf-8'))
	except (urllib.error.URLError, TimeoutError, ValueError) as error:
		raise ValueError(
			'Could not query the Solana RPC node. Verify your internet connection and try again.'
			if en
			else 'No se pudo consultar el nodo RPC de Solana. Comprueba tu conexión a internet e inténtalo de nuevo.'
		) from error

	if not isinstance(payload, dict) or payload.get('error'):
		raise ValueError(
			'The Solana RPC node returned an error while checking the transaction.'
			if en
			else 'El nodo RPC de Solana devolvió un error al comprobar la transacción.'
		)

	result = payload.get('result')
	if not isinstance(result, dict):
		raise ValueError(
			'Transaction not found or not yet confirmed on the Solana network.'
			if en
			else 'La transacción no se encontró o aún no está confirmada en la red Solana.'
		)

	meta = result.get('meta')
	if not isinstance(meta, dict) or meta.get('err') is not None:
		raise ValueError(
			'The Solana transaction failed on-chain and cannot be used.'
			if en
			else 'La transacción de Solana falló en la red y no puede utilizarse.'
		)

	pubkeys = _extract_pubkeys(result)
	lamports_delta = 0
	if SOLANA_WALLET in pubkeys:
		idx = pubkeys.index(SOLANA_WALLET)
		pre_balances = meta.get('preBalances')
		post_balances = meta.get('postBalances')
		if isinstance(pre_balances, list) and isinstance(post_balances, list):
			if idx < len(pre_balances) and idx < len(post_balances):
				try:
					lamports_delta = int(post_balances[idx]) - int(pre_balances[idx])
				except (TypeError, ValueError):
					lamports_delta = 0

	pre_tokens = _token_totals_for_owner(meta.get('preTokenBalances'), SOLANA_WALLET)
	post_tokens = _token_totals_for_owner(meta.get('postTokenBalances'), SOLANA_WALLET)
	usdc_delta = max(0.0, post_tokens.get(USDC_MINT_MAINNET, 0.0) - pre_tokens.get(USDC_MINT_MAINNET, 0.0))
	usdt_delta = max(0.0, post_tokens.get(USDT_MINT_MAINNET, 0.0) - pre_tokens.get(USDT_MINT_MAINNET, 0.0))
	spl_usd = usdc_delta + usdt_delta
	sol_usd = (lamports_delta / LAMPORTS_PER_SOL) * _sol_usd_price() if lamports_delta > 0 else 0.0
	total_usd = round(sol_usd + spl_usd, 2)

	if lamports_delta <= 0 and spl_usd <= 0:
		raise ValueError(
			f'Transaction does not transfer funds to the official Tabvento Solana wallet ({SOLANA_WALLET}).'
			if en
			else f'La transacción no transfiere fondos a la cartera oficial de Solana de Tabvento ({SOLANA_WALLET}).'
		)

	if total_usd + 1e-6 < MIN_CONTRIBUTION_USD:
		raise ValueError(
			f'Minimum contribution is ${MIN_CONTRIBUTION_USD} USD in SOL or USDC (no maximum limit). Detected: ${total_usd:.2f} USD.'
			if en
			else f'La contribución mínima es de ${MIN_CONTRIBUTION_USD} USD en SOL o USDC (sin límite máximo). Detectado: ${total_usd:.2f} USD.'
		)

	if isinstance(expected_memo, str) and expected_memo.strip():
		wanted = expected_memo.strip()
		memos = _extract_memos(result, meta)
		if not any(wanted in memo for memo in memos):
			raise ValueError(
				f'Transaction memo does not match this Tabvento instance ({wanted}). Include your device code in the Solana memo.'
				if en
				else f'El memo de la transacción no coincide con esta instancia de Tabvento ({wanted}). Incluye tu código de dispositivo en el memo de Solana.'
			)

	currency = 'USDC' if usdc_delta >= sol_usd and usdc_delta > 0 else ('USDT' if usdt_delta > sol_usd else 'SOL')
	return {
		'verified': True,
		'wallet': SOLANA_WALLET,
		'min_contribution_usd': MIN_CONTRIBUTION_USD,
		'max_contribution_usd': MAX_CONTRIBUTION_USD,
		'tx_signature': cleaned,
		'amount_usd': total_usd,
		'currency': currency,
		'verified_at': timestamp(),
	}


def verify_and_save_contribution(
	store: MissionStore,
	signature: object,
	*,
	lang: str = 'en',
) -> dict:
	code = device_code_for_store(store)
	verified_data = verify_solana_transaction(signature, expected_memo=code, lang=lang)
	record = {
		**verified_data,
		'device_code': code,
		'solana_pay_url': solana_pay_url(code),
	}
	store.set_setting('contribution', record)
	return contribution_status(store)
