# Third-Party Notices

**Tabvento** (`Copyright (c) 2026 Tabvento`) is distributed under the terms in `LICENSE`.

## Python Runtime Dependencies

Tabvento uses open-source Python packages declared in `pyproject.toml` and `uv.lock`, including Pydantic, Pydantic AI, Browser Harness, MCP, Pillow, and provider SDKs. Each dependency is governed by its own open-source license.

Live mission execution communicates directly with the user's configured model provider. Simulated Demo Mode runs locally without calling an AI model or launching an automation browser.

## Bundled Interface Fonts

The Tabvento web interface serves its fonts locally so no external font service is contacted when opening the dashboard:

- **DM Sans**: Copyright 2014 The DM Sans Project Authors (`https://github.com/googlefonts/dm-fonts`). Licensed under the SIL Open Font License 1.1 (`tabvento/web/fonts/DM-Sans-OFL.txt`).
- **Space Grotesk**: Copyright 2020 The Space Grotesk Project Authors (`https://github.com/floriankarsten/space-grotesk`). Licensed under the SIL Open Font License 1.1 (`tabvento/web/fonts/Space-Grotesk-OFL.txt`).

These SIL Open Font Licenses govern the bundled font files independently of the source code license in `LICENSE`.
