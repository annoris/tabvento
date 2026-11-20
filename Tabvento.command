#!/bin/zsh
# Double-click on macOS, or run ./Tabvento.command in a terminal.
set -eu
cd "${0:A:h}"
if command -v uv >/dev/null 2>&1; then
	tabvento_uv="$(command -v uv)"
elif [ -x "$HOME/.local/bin/uv" ]; then
	tabvento_uv="$HOME/.local/bin/uv"
else
	print 'Install uv from https://docs.astral.sh/uv/ and reopen Tabvento.'
	print 'Instala uv desde https://docs.astral.sh/uv/ y vuelve a abrir Tabvento.'
	exit 1
fi
print 'Open http://127.0.0.1:8765 in your browser. Press Ctrl+C to stop.'
print 'Abre http://127.0.0.1:8765 en tu navegador. Pulsa Ctrl+C para cerrar.'
exec "$tabvento_uv" run --locked tabvento
