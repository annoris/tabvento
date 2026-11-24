# Third-Party Notices

**Tabvento** (`Copyright (c) 2026 Tabvento`) is distributed under the terms in `LICENSE`.

## Bundled Browser Use Automation Engine

The `browser_use/` package includes code from [Browser Use 1.0.2](https://github.com/browser-use/browser-use/tree/1.0.2), together with local modifications. The original Browser Use code remains available under its MIT license below; Tabvento's activation terms do not replace or restrict the permissions granted by that upstream license. Tabvento's original contributions and modifications are governed by `LICENSE`, subject to the upstream rights in the preexisting code.

Upstream license: https://github.com/browser-use/browser-use/blob/1.0.2/LICENSE

```text
MIT License

Copyright (c) 2024 Gregor Zunic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Python Runtime Dependencies

Tabvento uses open-source Python packages declared in `pyproject.toml` and `uv.lock`, including Pydantic, Pydantic AI, Browser Harness, MCP, Pillow, and provider SDKs. Each dependency is governed by its own open-source license.

Live mission execution communicates directly with the user's configured model provider. Simulated Demo Mode runs locally without calling an AI model or launching an automation browser.

## Bundled Interface Fonts

The Tabvento web interface serves its fonts locally so no external font service is contacted when opening the dashboard:

- **DM Sans**: Copyright 2014 The DM Sans Project Authors (`https://github.com/googlefonts/dm-fonts`). Licensed under the SIL Open Font License 1.1 (`tabvento/web/fonts/DM-Sans-OFL.txt`).
- **Space Grotesk**: Copyright 2020 The Space Grotesk Project Authors (`https://github.com/floriankarsten/space-grotesk`). Licensed under the SIL Open Font License 1.1 (`tabvento/web/fonts/Space-Grotesk-OFL.txt`).

These SIL Open Font Licenses govern the bundled font files independently of the source code license in `LICENSE`.
