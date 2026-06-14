#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
set -a
source "$ROOT/.env"
set +a

if [[ "${1:-}" == "" ]]; then
  echo "Usage: $0 <chat_id> [message]"
  echo "Tip: send a DM to @$TELEGRAM_BOT_USERNAME, then inspect pairing with:"
  echo "  openclaw pairing list telegram"
  exit 1
fi

CHAT_ID="$1"
MESSAGE="${2:-Aida test message from OpenClaw.}"

curl -fsS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${CHAT_ID}" \
  --data-urlencode "text=${MESSAGE}" >/dev/null

echo "sent"
