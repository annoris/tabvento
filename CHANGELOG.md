# Changelog

All notable changes to **Tabvento** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-11-20

### Added
- **Local-First Mission Dashboard**: Bilingual (English & Spanish) local web desk running on `http://127.0.0.1:8765`.
- **Keyless Simulated Demo Mode**: 100% free sandbox simulation demonstrating the 4-phase deterministic execution pipeline without requiring external API keys.
- **Solana Web3 Activation Gate**: On-chain Solana Mainnet verification (`>= $88 USD` in SOL/USDC, no maximum limit) for wallet `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` to unlock Live Browser Mode.
- **Direct Multi-Provider Support**: Seamless adapters for OpenAI, Anthropic Claude, Google Gemini, Local Ollama, and generic OpenAI-compatible endpoints.
- **24 Curated Business Presets**: Categorized mission examples covering Market Research, E-Commerce, Developer QA, Lead Generation, Data Extraction, and Workflow Automation.
- **Interactive GitHub Pages Showcase**: Zero-dependency web showcase in `site/` (`https://annoris.github.io/tabvento/`) featuring client-side simulator, live HUD, and preset library.
- **Thread-Isolated SQLite Persistence**: Local storage for mission transcripts, connection configs, and on-chain verification flags.
- **Loopback Hardening**: Strict Host, Origin, and CSP headers protecting against DNS rebinding and cross-site execution.
- **Automated Quality & Verification Gates**: Pre-commit hygiene, Node-based pages validator (`scripts/validate_pages.mjs`), matrix CI workflows, and complete test suites.
