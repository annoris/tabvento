# Tabvento Full Guide

**Copyright © 2026 Tabvento.**

Tabvento is a local-first AI browser automation dashboard with an English (`EN`, default) and Spanish (`ES`) interface, persistent SQLite mission history, direct model connections, and Solana on-chain activation for live browser execution.

## 1. Startup and Local Data

```bash
uv sync --locked --all-extras
uv run tabvento
```

The server listens by default on `127.0.0.1:8765`. Use `--port` to change the port. Open `http://127.0.0.1:8765` in your browser to access the dashboard. Stopping the server does not erase mission history.

On macOS, `./Tabvento.command` (or double-clicking that file) prepares the local environment when needed and starts the dashboard.

Missions and settings are stored in a local SQLite database (`missions.sqlite3`). `TABVENTO_DATA_DIR` selects the data directory. Keep this directory private: tasks and results may contain content from visited web pages.

## 2. Simulated Demo Mode vs. Live Browser Mode

- **Simulated Demo (`mode: "demo"` — Free):** Lets you explore the interface with a simulated sequence—no API keys, automation browser, or payment required. Results are clearly labeled `SIMULATED DEMO`.
- **Live Browser (`mode: "live"` — Solana Activated):** Launches a local Chromium browser controlled by your configured AI model. Requires:
  1. A verified Solana activation payment of **at least $88 USD (no maximum limit)** in SOL or USDC to `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`.
  2. An explicit model provider connection saved in **Connections** with its API key configured in `.env` (or Local Ollama).
  3. Chrome, Chromium, or Edge installed locally (`uv run python -m browser_use install` installs Chromium if needed).

## 3. Solana Activation (`$88 USD` Minimum, No Maximum Limit)

In **Connections**, the **03 / SOLANA · UNLOCK LIVE MODE** card displays:

- **Official Solana Wallet:** `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`
- **Minimum Activation Payment:** `$88 USD` in SOL or USDC (**no maximum limit**)
- **Device Reference Code:** `TV-...` (optional Memo for Solana Pay)

After sending your activation payment on Solana Mainnet, paste the Base58 transaction signature and click **Verify Solana contribution**. Once verified, Live Browser Mode is permanently unlocked for your local data directory.

The $88 USD minimum is the payment for official Live activation; amounts above it are optional support, with no maximum. No renewal fee is introduced. The interface and API retain their existing “contribution” labels. Newly offered Tabvento-owned material uses the custom commercial [license](../LICENSE), while upstream MIT code, other third-party licenses, previously granted rights, and existing permanent local activations remain preserved. See the [licensing scope](commercial-plan.md#licensing-scope).

## 4. Model Connections

In **Connections**, you can configure:

| Provider | Environment Variable | Notes |
|---|---|---|
| OpenAI | `OPENAI_API_KEY` | Direct connection to `https://api.openai.com/v1` |
| Anthropic | `ANTHROPIC_API_KEY` | Direct connection to `https://api.anthropic.com` |
| Google Gemini | `GOOGLE_API_KEY` or `GEMINI_API_KEY` | Direct connection to Google Generative Language API |
| OpenAI-compatible API | `TABVENTO_COMPATIBLE_API_KEY` | Custom HTTP(S) `base_url` |
| Local Ollama | None required | Loopback URL (defaults to `http://127.0.0.1:11434/v1`) |

Model identifiers are preserved exactly as entered. Keys are read exclusively from the server environment (`.env`), never requested in browser forms or stored in SQLite.

## 5. Local HTTP API

The dashboard communicates with the local server over JSON and defaults to English (`en`), with Spanish (`es`) available via `Accept-Language: es`, `?lang=es`, or `"lang": "es"`:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/status` | Service status, credential presence, and Solana contribution status |
| `GET` | `/api/missions` | List mission history |
| `GET` | `/api/missions/{id}` | Retrieve a single mission and its timeline steps |
| `POST` | `/api/missions` | Create a mission (`task`, `mode`, optional `model`, optional `lang`) |
| `POST` | `/api/missions/{id}/cancel` | Request cancellation of an active mission |
| `DELETE` | `/api/missions/{id}` | Delete a completed, failed, or cancelled mission |
| `GET` | `/api/connections` | List providers and saved connection (never exposes keys) |
| `POST` | `/api/connections` | Save `provider`, `model`, and optional `base_url` |
| `POST` | `/api/connections/check` | Verify local configuration without contacting the model provider |
| `GET` | `/api/contribution` | Retrieve Solana wallet, minimum `$88 USD` requirement, and verification status |
| `POST` | `/api/contribution/verify` | Verify a Base58 Solana transaction signature (`{"signature": "..."}`) |

## 6. Verification & Testing

```bash
uv run pytest tests/ci -m "not chrome"
uv run pytest tests/test_tabvento.py
npm ci --prefix tests/frontend
npm test --prefix tests/frontend
uv run ruff check --no-fix
uv run pyright
uv build
```
