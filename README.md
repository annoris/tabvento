<p align="center">
  <img src="images/mark.svg" width="80" height="80" alt="Tabvento mark">
</p>

<h1 align="center">Tabvento</h1>
<p align="center"><strong>Autonomous AI Browser Automation Dashboard</strong></p>
<p align="center">
  A local-first, privacy-focused browser automation workspace. Run keyless simulated sandbox tests or unlock full local Chromium automation with your preferred AI provider.
</p>

<p align="center">
  <a href="https://annoris.github.io/tabvento/"><img src="https://img.shields.io/badge/Live_Showcase-GitHub_Pages-6366f1?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live GitHub Pages Showcase"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-All_Rights_Reserved-f59e0b?style=for-the-badge" alt="License"></a>
  <a href="#solana-web3-gate"><img src="https://img.shields.io/badge/Web3_Gate-Solana_Mainnet-14F195?style=for-the-badge&logo=solana&logoColor=black" alt="Solana Web3 Gate"></a>
</p>

---

## 🌟 Interactive Live Showcase

Experience Tabvento directly in your browser without installing anything:

👉 **[Launch Interactive GitHub Pages Showcase (https://annoris.github.io/tabvento/)](https://annoris.github.io/tabvento/)**

- **Simulated Mission Runner:** Watch step-by-step DOM interactions, telemetry HUD, and synthetic token counters in real-time.
- **24 Curated Presets Library:** Searchable and filterable business missions for Market Research, E-Commerce, Developer QA, Lead Gen, and Data Extraction.
- **Solana Web3 Gate Simulator:** Test Base58 signature validation against the official wallet.
- **Bilingual Switcher:** Instant one-click toggle between English (`EN`) and Spanish (`ES`).

---

## 📸 Interface & Workflow Gallery

<p align="center">
  <img src="images/01-inicio.png" width="48%" alt="Tabvento Workspace Home">
  <img src="images/02-escribe-tu-mision.png" width="48%" alt="Mission Composer">
</p>
<p align="center">
  <img src="images/03-resultado-demo.png" width="48%" alt="Simulated Demo Result Dossier">
  <img src="images/05-conexiones.png" width="48%" alt="Provider & Solana Connections">
</p>
<p align="center">
  <img src="images/06-example-library-desktop.png" width="98%" alt="24 Mission Example Catalog">
</p>

---

## 💎 Solana Web3 Gate (Live Browser Mode Activation)

**Simulated Demo Mode (`mode: "demo"`) is completely free for evaluation.** To unlock **Live Browser Mode (`mode: "live"`)** with a real local Chromium browser and your configured AI model provider:

| Parameter | Specification |
|---|---|
| **Official Solana Wallet** | `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` |
| **Minimum Contribution** | **$88.00 USD** (in native **SOL** or **USDC** on Solana Mainnet) |
| **Maximum Limit** | **No maximum limit** (contributions $\ge \$88\text{ USD}$ unlock permanent access) |
| **Verification Method** | Direct on-chain RPC lookup via Base58 transaction signature |
| **Persistence** | Unlocked permanently in local SQLite database (`tabvento.sqlite`) |

### How to Activate:
1. Transfer $\ge \$88\text{ USD}$ on Solana Mainnet to `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` (or use the **Open in Solana Pay ↗** button in the dashboard).
2. Navigate to **Connections** (`http://127.0.0.1:8765#conexiones`).
3. Paste your Base58 transaction signature and click **Verify Solana contribution**.
4. Tabvento confirms the transaction on-chain and unlocks Live Browser Mode permanently.

---

## 🤖 Supported AI Model Providers

Configure your model in local environment variables (`.env`). API keys are never transmitted to the browser or stored in SQLite:

- **OpenAI:** `gpt-4o`, `gpt-4o-mini`, `o1`, `o3-mini` (`OPENAI_API_KEY`)
- **Anthropic Claude:** `claude-3-7-sonnet`, `claude-3-5-haiku` (`ANTHROPIC_API_KEY`)
- **Google Gemini:** `gemini-2.0-flash`, `gemini-1.5-pro` (`GOOGLE_API_KEY`)
- **Local Ollama:** `llama3.2`, `qwen2.5`, `mistral`, `deepseek-r1` via `http://127.0.0.1:11434/v1` (100% private, 0 external API cost)
- **OpenAI-Compatible Custom:** vLLM, Together, Groq, DeepSeek, OpenRouter (`TABVENTO_COMPATIBLE_API_KEY`)

---

## 📚 24 Production Mission Presets

Tabvento includes 24 built-in mission presets engineered for Small & Medium Businesses, local service providers, marketing agencies, and operations:

| Category | Count | Example Scenarios |
|---|:---:|---|
| **Market Research** | 4 | Competitor pricing audits, industry news digest, tech stack detection |
| **E-Commerce** | 4 | Stock inventory monitoring, catalog price scraping, shipping policy analysis |
| **Developer QA** | 4 | Broken link scans, responsive navigation audit, accessibility checks |
| **Lead Generation** | 4 | Local business contact discovery, agency portfolio enrichment, directory search |
| **Data Extraction** | 4 | Financial table parsing, structured event aggregation, PDF download automation |
| **Workflow Automation** | 4 | Multi-step form completion, simulated tour, comparative checklist synthesis |

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph UI ["User Interface Layer"]
        DASH["Local Web Dashboard · EN / ES"]
        SHOWCASE["GitHub Pages Showcase (site/)"]
    end

    subgraph SERVER ["Local Loopback Server (127.0.0.1:8765)"]
        API["REST API & Security Gate"]
        STORE[("Thread-Isolated SQLite Store")]
    end

    subgraph DISPATCH ["Execution Dispatcher"]
        DEMO["Simulated Demo Engine (Free Sandbox)"]
        SOL["Solana On-Chain Gate (≥ $88 USD)"]
    end

    subgraph ENGINE ["Automation Engine"]
        BROWSER_USE["browser_use Agent Orchestrator"]
        CDP["Chrome DevTools Protocol (CDP)"]
        CHROME["Local Chromium Browser"]
        LLM["AI Model Adapter (OpenAI / Claude / Gemini / Ollama)"]
    end

    DASH -->|HTTP / JSON| API
    SHOWCASE -.->|Static Simulation| DASH
    API --> STORE
    API --> DEMO
    API --> SOL
    SOL -->|Verified Live| BROWSER_USE
    BROWSER_USE --> LLM
    BROWSER_USE --> CDP
    CDP --> CHROME
```

---

## 🔒 Security & Privacy Boundaries

- **Loopback Enforcement:** Binds strictly to `127.0.0.1`, enforcing strict `Host`, `Origin`, and `Content-Security-Policy` headers to block cross-origin attacks and DNS rebinding.
- **Zero Cloud Leaks:** Your browsing sessions, cookies, user profiles, and extracted data never leave your local machine.
- **Key Isolation:** API keys remain strictly in server environment variables (`.env`).
- **Cancellation Guarantee:** Stopping an active mission aborts local execution immediately.

---

## 📄 License & Governance

- **Copyright © 2026 Tabvento. All Rights Reserved.** This public repository hosts the interactive showcase and public documentation for Tabvento under the proprietary terms in [LICENSE](LICENSE).
- Third-party components and bundled font assets retain their respective licenses (including MIT and SIL Open Font License). See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- Governance & Policies: [Code of Conduct](CODE_OF_CONDUCT.md) · [Security Policy](SECURITY.md) · [Changelog](CHANGELOG.md).

---

## 🌐 Explore the JAP INTERNATIONAL & Annoris Ecosystem

Built by **JAP INTERNATIONAL** — Local-First AI Automation Platforms for Small & Medium Businesses (SMBs), agencies, clinics, e-commerce, and enterprise teams, alongside 60 FPS Creative Web Engineering showcases. Every project below includes an instant **Live Demo (zero login required)**.

### 🤖 AI & Local-First Business Automation
| Project | What It Solves | Stack | Live Demo |
| :--- | :--- | :--- | :---: |
| [**`aetheris`**](https://github.com/annoris/aetheris) | 77 AI Agents, 328 Skills & Local-First Automation Control Plane | Bun · Node · Ollama · MCP | [Live Demo ↗](https://annoris.github.io/aetheris/) |
| [**`aurelia`**](https://github.com/annoris/aurelia) | Self-Hosted Business AI Automation, RAG, Workflows & Local CRM | React 18 · Express · Prisma | [Live Demo ↗](https://annoris.github.io/aurelia/) |
| [**`lumenpitch`**](https://github.com/annoris/lumenpitch) | AI Presentation Studio & Multi-LLM Slide Generation Engine | Next.js 16 · FastAPI · Electron | [Live Demo ↗](https://annoris.github.io/lumenpitch/) |
| **`tabvento`** *(You are here)* | Autonomous AI Browser Automation Dashboard (Local-First BYOK) | Python · Playwright · SQLite | [Live Demo ↗](https://annoris.github.io/tabvento/) |
| [**`trading-bauhaus-journal`**](https://github.com/annoris/trading-bauhaus-journal) | AI Trading Journal with Claude/OpenAI Analyst & OHLC Replay | Next.js 15 · TypeScript · SQLite | [Live Demo ↗](https://annoris.github.io/trading-bauhaus-journal/) |

### 🎨 Creative Engineering & 60 FPS Web Showcases
| Project | Experience & Motion Engineering | Stack | Live Demo |
| :--- | :--- | :--- | :---: |
| [**`kairo`**](https://github.com/annoris/kairo) | 60 FPS Spatial Web: Navier-Stokes Fluid, GLSL Shaders & Rapier 3D | Next.js 14 · Three.js · GLSL | [Live Demo ↗](https://annoris.github.io/kairo/) |
| [**`valence`**](https://github.com/annoris/valence) | Zero-Bundler 60 FPS Awwwards Agency Template (MIT) | HTML5 · CSS3 · GSAP · Lenis | [Live Demo ↗](https://annoris.github.io/valence/) |
| [**`luma`**](https://github.com/annoris/luma) | Zero-Dependency Botanical Brand Experience + 106 BPM Web Audio Synth | HTML5 · CSS3 · Web Audio API | [Live Demo ↗](https://annoris.github.io/luma/) |
| [**`valtor`**](https://github.com/annoris/valtor) | Luxury Automotive Digital Flagship — 60 FPS GSAP + SplitText | Vite · ES Modules · GSAP | [Live Demo ↗](https://annoris.github.io/valtor/) |
| [**`solterra`**](https://github.com/annoris/solterra) | Luxury Desert Architecture Showcase — GSAP ScrollSmoother | React 19 · Vite 6 · Tailwind 4 | [Live Demo ↗](https://annoris.github.io/solterra/) |
| [**`moxie`**](https://github.com/annoris/moxie) | Bold Social-First Creative Agency Experience — GSAP Inertia | Next.js 15 · React 19 · Lenis | [Live Demo ↗](https://annoris.github.io/moxie/) |
| [**`kineta`**](https://github.com/annoris/kineta) | Locked-60fps Brutalist Editorial Showcase & Variable Font Physics | Vanilla JS · GSAP · Lenis | [Live Demo ↗](https://annoris.github.io/kineta/) |
| [**`solmora`**](https://github.com/annoris/solmora) | Editorial Mediterranean E-Commerce Showcase (MIT, Zero-Deps) | HTML5 · CSS3 · Vanilla JS | [Live Demo ↗](https://annoris.github.io/solmora/) |

> ⭐ **Enjoyed exploring this project?** Drop a **Star** on GitHub and check out the full portfolio at [**github.com/annoris**](https://github.com/annoris) — it helps other builders discover the ecosystem!
