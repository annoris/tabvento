# Tabvento: Developer & Agent Guide

Tabvento is a local-first AI browser automation dashboard with an English/Spanish (`EN`/`ES`) interface, SQLite persistence, user-configured model providers, and Solana on-chain activation (`3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`, minimum `$88 USD`, no maximum limit).

## Architecture

- `tabvento/server.py`: Local loopback HTTP server and REST API.
- `tabvento/solana_gate.py`: On-chain Solana transaction verification (`>= $88 USD` in SOL/USDC, no maximum limit) and Live Mode gate.
- `tabvento/connections.py`: Direct model provider validation and adapter construction.
- `tabvento/runner.py`: Simulated demo runner and live local-browser mission runner.
- `tabvento/store.py`: Thread-isolated SQLite persistence.
- `tabvento/web/`: Local web interface (`index.html`, `app.js`, `i18n.js`, `styles.css`) and bundled fonts.
- `browser_use/`: Internal automation engine package.

## Development & Quality Checks

Use `uv`, tabs (`\t`) for Python indentation, and modern type unions (`str | None`).

```bash
uv sync --locked --all-extras
uv run pytest tests/ci tests/test_tabvento.py -m "not chrome"
npm ci --prefix tests/frontend
npm test --prefix tests/frontend
uv run ruff check --no-fix
uv run pyright
uv build
```

Tests must never call paid external APIs or create cloud browsers. Use mocked models and simulated HTTP/RPC responses.

## Rules

- Simulated Demo Mode works without external accounts or keys; Live Browser Mode requires a verified Solana contribution (`>= $88 USD`, no maximum limit) to `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`.
- Preserve `LICENSE` (`Copyright (c) 2026 Tabvento`) and `THIRD_PARTY_NOTICES.md`.
- Never substitute unfamiliar model identifiers with different names.
- Never commit `.env`, API keys, cookies, SQLite databases, private results, virtual environments, or caches.
- Do not casually edit `browser_use/agent/prompt.py`.
