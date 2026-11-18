# Contributing to Tabvento

Thanks for helping improve Tabvento. Start with a small, reproducible issue or an improvement to the mission workflow, setup guide, or accessibility.

## Development setup

Use Python 3.11 or newer and uv:

```sh
uv sync --locked --all-extras --dev
```

Before opening a pull request, run:

```sh
uv run pytest tests -m "not chrome"
uv run ruff check --no-fix
uv run pyright
npm ci --prefix tests/frontend
npm test --prefix tests/frontend
uv build
```

Tests must use scripted models and local pages or mocked HTTP. Never call paid model providers or create cloud browsers in tests. Tests marked `chrome` require a local browser. Add a regression test when fixing a functional bug.

## Useful contributions

- Reproducible installation or browser-connection fixes.
- Clearer English and Spanish interface copy.
- Keyboard accessibility and reduced-motion improvements.
- Tests for mission history, cancellation, and connection configuration.
- Documentation that clearly distinguishes simulated demos from live execution.

Describe the problem, the change, and the checks you ran. Preserve third-party code and font licenses. Do not attach `.env`, API keys, cookies, browser profiles, mission databases, or private task histories.

Discuss large changes before implementing them. The Pro offer is a proposal; do not document checkout or activation as available features.
