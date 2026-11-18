# Tabvento Commercial & Solana Activation Plan

**Copyright © 2026 Tabvento.**

**Simulated Demo Mode (`mode: "demo"`)** is 100% free so anyone downloading Tabvento from GitHub can explore the bilingual (`EN` / `ES`) mission desk and local SQLite workflow without API keys or fees.

To unlock **Live Browser Mode (`mode: "live"`)**, Tabvento uses on-chain verification on **Solana Mainnet**:

- **Official Solana Wallet:** `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`
- **Minimum Contribution:** **$88 USD** (in native SOL or SPL USDC on Solana Mainnet)
- **Maximum Limit:** **No maximum limit** (any contribution equal to or greater than `$88 USD` is valid)
- **Local Activation:** Paste the Base58 `Transaction Signature` in the **Connections** tab (`POST /api/contribution/verify`). Tabvento verifies on-chain receipt at `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` and stores the unlocked status in local SQLite.

## Activation Summary

| Tier / Parameter | Specification |
|---|---|
| **Simulated Demo Mode** | Free (`mode: "demo"`) |
| **Live Browser Mode** | Unlocked via verified Solana contribution (`mode: "live"`) |
| **Official Solana Wallet** | `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` |
| **Minimum Contribution** | **$88 USD** in SOL or USDC (**no maximum limit**) |
| **AI Model Usage** | Billed separately by the user's chosen provider via their own `.env` key, or free locally via Ollama |
| **Privacy & Security** | No API keys, mission tasks, or browsing history are sent to a licensing server |

## On-Chain Verification Architecture

1. **Deterministic Device Reference:** Each local installation generates a non-invasive reference code (`TV-<12 hex chars>`) and a Solana Pay link (`solana:3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm?label=Tabvento&memo=TV-...`).
2. **Base58 & JSON-RPC Validation:** `tabvento/solana_gate.py` validates the Base58 transaction signature and queries Solana JSON-RPC (`getTransaction`, `jsonParsed`, `confirmed`) to verify that `meta.err is None` and that `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` received at least `$88 USD` in SOL or USDC (with no maximum limit).
3. **Dual-Barrier Enforcement:** Both the HTTP admission layer (`tabvento/server.py`, returning `HTTP 402 Payment Required`) and the worker execution layer (`tabvento/runner.py`) verify the Solana activation state before launching a live browser session.
4. **License Compliance:** Distributed under [LICENSE](../LICENSE) (`Copyright (c) 2026 Tabvento`).
