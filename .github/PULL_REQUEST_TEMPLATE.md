## Description

Briefly describe the purpose of this PR and what problem it solves.

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Refactoring or code hygiene (no functional changes)
- [ ] Documentation update
- [ ] CI / Build / Automation improvement

## Quality Gates & Verification

Please ensure the following checks pass before requesting review:

- [ ] Python tests pass: `uv run pytest tests/ci tests/test_tabvento.py -m "not chrome"`
- [ ] Frontend tests pass: `npm test --prefix tests/frontend`
- [ ] Linter clean: `uv run ruff check --no-fix`
- [ ] Type checker clean: `uv run pyright`
- [ ] Package build clean: `uv build`
- [ ] Python indentation uses tabs (`\t`) in line with Tabvento conventions.
- [ ] No API keys, credentials, cookies, or `.env` files are included.
- [ ] Simulated Demo Mode continues to run without requiring external keys.

## Related Issues

Closes #
