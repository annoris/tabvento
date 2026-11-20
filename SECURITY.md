# Security Policy

Tabvento takes local-first privacy and security seriously.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

---

## Reporting a Vulnerability

If you discover a security vulnerability in Tabvento, please **do not open a public issue**. Instead, submit a private advisory through GitHub or report it directly to the project maintainers.

### Response Timeline
- **Initial acknowledgment**: Within 48 hours.
- **Triage & severity assessment**: Within 5 business days.
- **Fix & advisory release**: Coordinated disclosure following verified resolution.

---

## Architectural Security Model

1. **Loopback Binding**: The Tabvento HTTP server binds exclusively to `127.0.0.1`. It rejects non-loopback Host headers and enforces strict Content Security Policy (CSP), `Origin`, and `Sec-Fetch-Site` restrictions to prevent cross-site request forgery and DNS rebinding attacks.
2. **Zero Cloud Key Exposure**: LLM provider API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, etc.) remain exclusively in your local `.env` environment. They are never transmitted to browser frontends, never logged, and never written into SQLite.
3. **Local-First Execution**: Browser automation runs locally on your machine via local Chromium. Tabvento does not send your browser sessions, cookies, or DOM snapshots to third-party cloud brokers.
4. **On-Chain Solana Gate**: Live Mode verification queries the Solana Mainnet directly via RPC for on-chain signatures to wallet `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`. No custodial accounts or personal identification are collected.
