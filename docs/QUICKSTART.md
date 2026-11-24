# Tabvento Quick Start

Explore a simulated mission first, then verify your Solana activation payment and connect an AI model when you are ready for live browser automation.

## 1. Start Locally

Install Python 3.11 or newer and [uv](https://docs.astral.sh/uv/). Open a terminal in the project directory:

```bash
uv sync --locked --all-extras
uv run tabvento
```

Open **http://127.0.0.1:8765**. On macOS, double-clicking `Tabvento.command` is an alternative startup method. To use another port:

```bash
uv run tabvento --port 8766
```

## 2. Three-Minute Demo Tour (Free)

1. The dashboard opens in **English (`EN`)** by default (you can switch between **EN** and **ES** anytime in the top bar).
2. Choose **Simulated demo** in the mission composer, or click **Start demo**.
3. Watch the mission progress through its simulated steps and open the finished result.
4. Inspect the mission history, test cancellation, or delete a finished record.

No API key, browser installation, or Solana transaction is required for Simulated Demo Mode.

## 3. Unlock and Run Live Browser Missions

### Step 1: Verify Your Activation Payment (Minimum $88 USD, No Maximum Limit)

1. Send an activation payment of **at least $88 USD** (in SOL or USDC, with **no maximum limit**) on Solana Mainnet to the official Tabvento wallet:
   `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`
2. Open **Connections** (`http://127.0.0.1:8765#conexiones`), paste your Base58 **Solana Transaction Signature**, and click **Verify Solana contribution**.

The minimum is the payment for official Live activation. Any additional amount is optional support, with no maximum. The verification button still uses the existing “contribution” label. Read the [license](../LICENSE) and [licensing scope](commercial-plan.md#licensing-scope); third-party licenses and previously granted rights are preserved.

### Step 2: Install a Local Browser

Use a compatible Chrome, Chromium, or Edge installation. If needed:

```bash
uv run python -m browser_use install
```

### Step 3: Configure Provider Credentials

Copy `.env.example` to `.env` in the project root and set the key for your chosen provider:

| Connection | Server Environment Variable |
|---|---|
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Google Gemini | `GOOGLE_API_KEY` or `GEMINI_API_KEY` |
| Remote OpenAI-compatible API | `TABVENTO_COMPATIBLE_API_KEY` |
| Local Ollama | No key required |

Restart Tabvento after editing `.env`. Never paste API keys into the browser or commit `.env` to GitHub.

### Step 4: Save Your Provider and Model

In **Connections**, select your provider, enter the exact model identifier, and click **Save connection**. Then return to **Overview**, choose **Live browser**, and start your mission.

[Back to README](../README.md)
