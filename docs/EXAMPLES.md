# 24 Tabvento Mission Examples

These are mission briefs to paste into Tabvento itself. Examples 1–6 exercise the free simulator; examples 7–24 request real, read-only visits to public pages. Website content and accessibility can change, so Live outputs are expectations, not guaranteed results or recorded demonstrations.

See the [visual walkthrough](EXAMPLES_VISUAL_GUIDE.md) for the dashboard appearance, the [Quick Start](QUICKSTART.md) for installation, and the [full guide](tabvento.md) for configuration details.

## Install and open the workspace

In the project directory, with Python 3.11+ and uv installed:

```bash
uv sync --locked --all-extras
uv run tabvento
```

Open `http://127.0.0.1:8765`. Keep the local server running while using the dashboard. For another port, run `uv run tabvento --port 8766` and open that port instead.

## Prerequisites and the real UI flow

**Demo prerequisites:** only the running local dashboard. No model, credentials, browser automation installation, or payment. Demo always uses a fixed simulated timeline and echoes the submitted goal. It never visits the URLs in a prompt or generates the requested research.

**Live prerequisites:** verified official activation (minimum $88 USD on Solana; optional additional support has no maximum), a compatible local Chrome/Chromium/Edge browser, and a saved working model connection. Use the [activation and provider setup](QUICKSTART.md#3-unlock-and-run-live-browser-missions); these examples do not initiate payments. Live model usage may incur your provider’s charges. You can read or rehearse any Live brief in Demo, but the output will remain simulated.

In **Connections**, choose OpenAI, Anthropic, Google Gemini, Local Ollama, or OpenAI-compatible API. Enter your provider’s **exact existing model identifier** under **Exact model identifier**; this guide deliberately does not substitute or invent a model name. For Local Ollama, use the name of an already downloaded compatible model and the local service URL `http://127.0.0.1:11434/v1`. For a remote compatible service, use its documented endpoint without credentials in the URL. Provider keys belong in the server environment or `.env`, never in a mission prompt or browser field. Restart Tabvento after changing `.env`.

Click **Save connection**, then **Check configuration**. This checks local prerequisites only; it does not verify provider authentication, balance, model availability, or that the model can complete browser tasks. Saving a connection does not itself run a model request. New Live missions use the saved connection; these examples do not promise reuse of a logged-in browser session across missions.

**Demo run steps:** open **Overview**, paste the example under **Describe your mission**, choose **Simulated demo**, and click the composer’s **Start demo**. The separate hero **Start demo** button launches its own built-in prompt instead. The mission detail dialog opens with status, timeline, and eventually its simulated result.

**Live run steps:** open **Overview**, paste the example under **Describe your mission**, choose **Live browser**, and click **Start mission**. Inspect the opened detail dialog for progress, result, or a reported error. These briefs use explicit URLs so they do not depend on a separate web-search feature. They request no purchases, account changes, messages, form submissions, or installations. Review the prompt before starting; Live executes with your local user permissions.

## Mission catalog

You can also expand **Explore 24 example missions** below the composer in **Overview** and select a card to fill the task draft. The six **Demo exercise** cards and eighteen **Live idea** cards match the briefs below. Selection does not start a mission or change the selected mode/provider. Review the brief and mode, then click **Start demo** or **Start mission** yourself. The default Demo remains simulated even when a brief mentions public URLs.

### 1. First demo mission

**Objective:** Demo workspace tour. **Mode:** Simulated demo.

**Prerequisites:** Demo prerequisites above; no account or activation required.

**Paste this mission:**

```text
Identify three sources I could consult to learn about browser automation, and organize a research workflow.
```

**UI steps:** Follow the Demo run steps above.

**Expected result:** A SIMULATED DEMO result echoes this goal and shows the fixed sample workflow; it does not identify real sources.

### 2. Compare mission briefs

**Objective:** Task labeling and history. **Mode:** Simulated demo.

**Prerequisites:** Demo prerequisites above; no account or activation required.

**Paste this mission:**

```text
Compare two approaches to organizing a project: a checklist and a calendar. Return a short comparison.
```

**UI steps:** Follow the Demo run steps above.

**Expected result:** A simulated result containing the submitted brief, not an actual comparison. Use this task label to find the record in Missions.

### 3. Review a research brief

**Objective:** Timeline inspection. **Mode:** Simulated demo.

**Prerequisites:** Demo prerequisites above; no account or activation required.

**Paste this mission:**

```text
Read this research brief: investigate accessible website navigation. Organize the goal into research steps.
```

**UI steps:** Follow the Demo run steps above.

**Expected result:** The fixed four-step simulated timeline and an explicitly simulated result; no analysis of accessibility is performed.

### 4. Practice cancellation

**Objective:** Stopping local execution. **Mode:** Simulated demo.

**Prerequisites:** Demo prerequisites above; no account or activation required.

**Paste this mission:**

```text
Prepare a research workflow for a public documentation page. This is a disposable cancellation practice mission.
```

**UI steps:** Follow the Demo run steps above. While the detail dialog is still running, click **Cancel mission** immediately. Cancellation cannot undo actions already performed; this demo has no browser actions.

**Expected result:** If cancelled before completion, the record is Cancelled; if the short demo already completed, create another and cancel immediately.

### 5. Practice exporting a result

**Objective:** Copying and downloading. **Mode:** Simulated demo.

**Prerequisites:** Demo prerequisites above; no account or activation required.

**Paste this mission:**

```text
Prepare a sample workflow for collecting public reference links. Mark this mission EXPORT-PRACTICE.
```

**UI steps:** Follow the Demo run steps above. After completion, click **Copy result** or **Download** in the detail dialog. Download saves `tabvento-<mission-id>.txt`.

**Expected result:** A simulated result that can be copied or downloaded as text; the download is not a browser screenshot or a spreadsheet.

### 6. Practice history search

**Objective:** Finding saved missions. **Mode:** Simulated demo.

**Prerequisites:** Demo prerequisites above; no account or activation required.

**Paste this mission:**

```text
Prepare a sample workflow for a reading list. Mark this mission HISTORY-PRACTICE.
```

**UI steps:** Follow the Demo run steps above. Close the detail dialog, open **Missions**, search for `HISTORY-PRACTICE`, select **Completed**, and open the matching record.

**Expected result:** A persisted simulated record whose task text can be found using HISTORY-PRACTICE in Missions.

### 7. Read a simple public page

**Objective:** First real browser visit. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://example.com/ and read the page. Return its page title, main heading, and the destination of its visible information link. Do not follow other links.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** Observed title, heading, and link URL from a real page.

### 8. Extract documentation section names

**Objective:** Headings extraction. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://docs.python.org/3/tutorial/ and list the first five numbered tutorial section names and their links. Read only; do not sign in or download files.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** Five visible section names with source links, or a clear access limitation.

### 9. Summarize one documentation topic

**Objective:** Focused summary. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://docs.python.org/3/tutorial/datastructures.html and summarize the difference between lists and tuples in at most five bullets. Cite the source URL. Do not run code or install anything.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** A short source-based summary from the visited documentation.

### 10. Compare two documentation pages

**Objective:** Two-source comparison. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://docs.python.org/3/library/json.html and https://docs.python.org/3/library/csv.html. Compare what each module reads and writes in a two-row plain-text table. Include both source URLs. Do not run code or download files.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** A compact comparison based on the two visited pages.

### 11. Extract HTML reference headings

**Objective:** Reference navigation. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://developer.mozilla.org/en-US/docs/Web/HTML and identify up to five visible learning or reference section headings. Include the source URL. Do not submit forms or sign in.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** Up to five observed headings with the source URL.

### 12. Find a definition on one page

**Objective:** Targeted reading. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://developer.mozilla.org/en-US/docs/Web/CSS and explain what CSS is in three sentences based only on this page. Include the source URL. Read only.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** A short explanation grounded in the visible page.

### 13. Build a short reading list

**Objective:** Bounded link collection. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://docs.python.org/3/tutorial/ and collect three tutorial links suitable for a first reading session. Return each title and URL with one short reason. Stay on this site and do not download anything.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** Three observed links with short explanations; no files created on external services.

### 14. Inspect a project landing page

**Objective:** Public project overview. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://www.sqlite.org/ and summarize the product description and up to three visible navigation destinations. Include their URLs. Do not download software or submit anything.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** An overview and observed navigation links from the public page.

### 15. Locate official installation guidance

**Objective:** Documentation discovery. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://docs.astral.sh/uv/getting-started/installation/ and summarize the visible installation choices without executing commands or downloading anything. Include the source URL.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** A summary of documentation, not a completed installation.

### 16. Read command documentation

**Objective:** Explain an existing tool. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://docs.astral.sh/uv/concepts/projects/sync/ and summarize the documented distinction between locking and syncing. Include the source URL. Do not execute any commands.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** A cited summary of the page; no environment changes.

### 17. Collect public accessibility resources

**Objective:** Resource discovery from a known URL. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://www.w3.org/WAI/fundamentals/accessibility-intro/ and return the page title and up to three visible links about learning accessibility. Include full URLs. Read only.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** Observed title and up to three resource URLs.

### 18. Create a source-based checklist

**Objective:** Turn documentation into notes. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://www.w3.org/WAI/tutorials/page-structure/ and create a five-item reading checklist based on visible page-structure topics. Include the source URL. Do not test or modify any website.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** A text checklist derived from the source, not an accessibility audit.

### 19. Inspect a public repository overview

**Objective:** Read repository metadata. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://github.com/psf/requests and report its visible project description, license label if shown, and documentation link if shown. Do not sign in, star, fork, clone, or create issues.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** Observed public metadata, with missing fields labeled unavailable.

### 20. Read a license as plain text

**Objective:** Locate license information. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://choosealicense.com/licenses/mit/ and summarize the permissions and notice condition displayed on the page. Include its URL. Provide a factual page summary, not legal advice. Read only.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** A short factual summary of the visited license information.

### 21. Gather learning links from Wikipedia

**Objective:** Public article navigation. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://en.wikipedia.org/wiki/Web_browser and report the opening definition plus up to three visible section names. Include the article URL. Do not edit the article or sign in.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** An observed definition and section names, or a stated access limitation.

### 22. Compare product descriptions

**Objective:** Two public sources. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://www.mozilla.org/en-US/firefox/ and https://www.chromium.org/Home/ and summarize how each page describes its browser project. Give one short paragraph per source with URL. Do not download or install anything.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** Two source-attributed descriptions, not a benchmark or recommendation to buy.

### 23. Find a public FAQ topic

**Objective:** Locate relevant page content. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://www.sqlite.org/faq.html and locate one question about supported data types. Summarize the visible answer briefly and include its link or source URL. Read only; do not execute SQL.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** A short summary of one observed FAQ answer.

### 24. Produce a bounded final report

**Objective:** Report with source and limitation. **Mode:** Live browser.

**Prerequisites:** Live prerequisites above; public-page access and a saved working provider.

**Paste this mission:**

```text
Open https://docs.python.org/3/ and return a report with three sections: page purpose, three visible documentation links, and any information you could not verify. Use only this page and do not download anything.
```

**UI steps:** Follow the Live run steps above.

**Expected result:** A structured report grounded in one visited page, including uncertainty rather than invented details.

## Revisit results, change language, and recover

- **History:** open **Missions** and use the task search and **All statuses**, **Running**, **Completed**, **Failed**, or **Cancelled** filter. Reopen a record to view its timeline and result. History is stored in local SQLite; refreshing the page or restarting with the same data directory preserves stored records. This is mission history, not guaranteed browser-session persistence.
- **Copy and export:** a nonempty result reveals **Copy result** and **Download**. If clipboard access fails, select the result text manually. Download produces a `.txt` report, not screenshots, PDF, CSV, or browser-profile export.
- **Delete a disposable record:** wait for completion or cancel it, open its details, click **Remove from history**, then **Confirm deletion**. Export first if needed; this deletes the stored mission and does not undo website actions.
- **Language:** use **ES** and **EN** in the top bar. Switching language changes interface labels; it does not translate old mission results retroactively. Return to **EN** before following the English button names here. Start a new Demo to see result text in the selected language.
- **Missing provider:** if Live sends you to **Connections**, save a valid exact model identifier, then return to **Overview**. Do not assume the failed attempt was a completed mission.
- **Missing activation:** follow the activation status in **Connections**, or select **Simulated demo** to continue free. No example requires a new payment merely to preview its brief.
- **Provider errors:** inspect the mission error, check the chosen model/endpoint and server environment, restart after credential changes, and create a new mission. A successful local configuration check does not prove a key or model is valid. Do not post credentials when sharing errors.
- **Website unavailable:** check the public URL yourself and use a smaller read-only brief or another listed example. Report a blocked page or unavailable information; do not treat a guessed answer as verified evidence.
- **Offline dashboard:** restart `uv run tabvento`, open the correct local port, and refresh. Existing history remains in the same data directory.
- **Concurrency:** at most three missions run at once. Wait or cancel one before submitting another. If a short Demo finishes before you cancel, repeat example 4 and act immediately.

These examples are documentation prompts, not claims that the Live tasks were executed or benchmarked. No paid model calls or cloud browsers are needed to read this guide or run the Demo exercises.

[Back to README](../README.md) · [Visual walkthrough](EXAMPLES_VISUAL_GUIDE.md)
