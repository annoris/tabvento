# Contributing to Tabvento

Thank you for contributing to Tabvento! Tabvento is a source-available (`LicenseRef-Tabvento`), local-first AI browser automation platform designed for small and medium businesses, agencies, and enterprise automation. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for licensing terms.

---

## Code of Conduct

Please read and abide by our [Code of Conduct](CODE_OF_CONDUCT.md) in all repository interactions.

---

## Development Prerequisites

- **Python 3.11+** (Python 3.12 recommended)
- **[uv](https://docs.astral.sh/uv/)** (Fast Python package manager)
- **Node.js 22+** (For frontend test runner and showcase validation)

---

## Quickstart & Environment Setup

```bash
# Clone the repository
git clone https://github.com/annoris/tabvento.git
cd tabvento

# Synchronize virtual environment with all extras and dev tools
uv sync --locked --dev --all-extras

# Install frontend test dependencies
npm ci --prefix tests/frontend
```

---

## Running the Application Locally

```bash
# Launch Tabvento local dashboard (defaults to http://127.0.0.1:8765)
uv run tabvento

# Or with a custom port
uv run tabvento --port 8766
```

---

## Quality Verification Gates

Before submitting any Pull Request, ensure that all quality gates pass cleanly:

```bash
# 1. Run Tabvento backend tests
uv run pytest tests/test_tabvento.py -m "not chrome"

# 2. Run frontend unit tests
npm test --prefix tests/frontend

# 3. Validate GitHub Pages showcase
node scripts/validate_pages.mjs

# 4. Run Ruff linter (must have 0 errors)
uv run ruff check --no-fix

# 5. Run Pyright type checker (must have 0 errors)
uv run pyright

# 6. Verify distribution build
uv build
```

---

## Coding Standards

- **Python Indentation**: Use **tabs** (`\t`) for indentation in Python files, per Tabvento architectural rules.
- **Modern Types**: Use modern Python type unions (`str | None`, `list[dict[str, Any]]`).
- **Web Frontend**: Vanilla ES modules and clean CSS variables. Do not introduce heavy runtime frameworks into the core dashboard or showcase.
- **Privacy & Security**: Never commit `.env`, API keys, session tokens, browser cookies, or private SQLite databases (`missions.sqlite3`).
- **Licensing**: Preserve third-party code and font licenses (`THIRD_PARTY_NOTICES.md`) and respect `LicenseRef-Tabvento` terms in [LICENSE](LICENSE).
- **Simulated vs. Live**: Tests must always use simulated models and local fixtures. Never call paid model APIs or external cloud browsers in CI.

---

## Reporting Issues

- Use the structured [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.yml) to report defects.
- Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.yml) to propose enhancements.
- For security vulnerabilities, review our [Security Policy](SECURITY.md).
