#!/usr/bin/env bash
# Prepare this Tabvento checkout without fetching another project.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."
if ! command -v uv >/dev/null 2>&1; then
    echo "Install uv, then run this script again."
    exit 1
fi
uv sync --dev --all-extras
echo "Start Tabvento: uv run tabvento"
echo "Configure provider credentials in .env; see .env.example."
