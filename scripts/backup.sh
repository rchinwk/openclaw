#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DEST_DIR="$ROOT/data/backups"
ARCHIVE="$DEST_DIR/aida-backup-$STAMP.tgz"

umask 077
mkdir -p "$DEST_DIR"

tar -czf "$ARCHIVE" \
  -C "$ROOT" .env config workspace docker-compose.yml README.md AGENTS.md scripts \
  -C "$HOME" .openclaw

echo "$ARCHIVE"
