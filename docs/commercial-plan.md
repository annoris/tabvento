# Tabvento Commercial & Solana Activation Plan

**Copyright © 2026 Tabvento.**

**Simulated Demo Mode (`mode: "demo"`)** is 100% free so anyone downloading Tabvento from GitHub can explore the bilingual (`EN` / `ES`) mission desk and local SQLite workflow without API keys or fees.

To unlock **Live Browser Mode (`mode: "live"`)**, Tabvento uses on-chain verification on **Solana Mainnet**:

- **Official Solana Wallet:** `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`
- **Minimum Activation Payment:** **$88 USD** (in native SOL or SPL USDC on Solana Mainnet)
- **Maximum Limit:** **No maximum limit** (any payment equal to or greater than `$88 USD` is valid; amounts above the minimum are optional support)
- **Local Activation:** Paste the Base58 `Transaction Signature` in the **Connections** tab (`POST /api/contribution/verify`). Tabvento verifies on-chain receipt at `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` and stores the unlocked status in local SQLite.

The $88 USD minimum is a required payment for official Live Browser Mode activation, rather than a voluntary donation. Any amount above $88 USD is optional project support. The existing interface and API retain the label “contribution” for compatibility. Payment verification does not by itself record acceptance of a versioned license agreement.

## Licensing Scope

Newly offered Tabvento-owned material is source-available under the custom commercial [LICENSE](../LICENSE). This is not a declaration that the entire distribution is MIT-licensed or OSI-approved open source. Upstream engine code and dependencies retain their independent licenses; see [third-party notices](../THIRD_PARTY_NOTICES.md) and [upstream provenance](upstream-browser-use.md).

This transition applies prospectively. Previously granted rights remain subject to their original terms. Existing permanent local activations are preserved, and no renewal charge is introduced. Free Simulated Demo evaluation does not require payment; independent MIT rights do not depend on purchasing Tabvento activation.

## Activation Summary

| Tier / Parameter | Specification |
|---|---|
| **Simulated Demo Mode** | Free (`mode: "demo"`) |
| **Live Browser Mode** | Unlocked via verified Solana activation payment (`mode: "live"`) |
| **Official Solana Wallet** | `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` |
| **Minimum Activation Payment** | **$88 USD** in SOL or USDC (**no maximum limit**) |
| **AI Model Usage** | Billed separately by the user's chosen provider via their own `.env` key, or free locally via Ollama |
| **Privacy & Security** | No API keys, mission tasks, or browsing history are sent to a licensing server |

## On-Chain Verification Architecture

1. **Deterministic Device Reference:** Each local installation generates a non-invasive reference code (`TV-<12 hex chars>`) and a Solana Pay link (`solana:3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm?label=Tabvento&memo=TV-...`).
2. **Base58 & JSON-RPC Validation:** `tabvento/solana_gate.py` validates the Base58 transaction signature and queries Solana JSON-RPC (`getTransaction`, `jsonParsed`, `confirmed`) to verify that `meta.err is None` and that `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` received at least `$88 USD` in SOL or USDC (with no maximum limit).
3. **Dual-Barrier Enforcement:** Both the HTTP admission layer (`tabvento/server.py`, returning `HTTP 402 Payment Required`) and the worker execution layer (`tabvento/runner.py`) verify the Solana activation state before launching a live browser session.
4. **License Compliance:** Distributed under [LICENSE](../LICENSE) (`Copyright (c) 2026 Tabvento`).
