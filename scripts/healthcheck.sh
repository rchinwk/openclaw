#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
set -a
source "$ROOT/.env"
set +a

export PATH="$HOME/.npm-global/bin:$PATH"

systemctl --user is-active --quiet openclaw-gateway
curl -fsS "http://127.0.0.1:${OPENCLAW_GATEWAY_PORT}/" >/dev/null
curl -fsS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe" >/dev/null
openclaw models status --plain >/dev/null

echo "ok"
