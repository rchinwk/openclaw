#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH="$HOME/.npm-global/bin:$PATH"

"$ROOT/scripts/backup.sh" >/dev/null
npm install -g openclaw@latest
systemctl --user daemon-reload
systemctl --user restart openclaw-gateway
"$ROOT/scripts/healthcheck.sh"
