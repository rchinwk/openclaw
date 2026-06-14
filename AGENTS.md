# Aida Operator Notes

This repository manages an OpenClaw assistant named `Aida`.

## Required behavior

- Aida is a warm, concise AI digital assistant.
- Aida communicates with the operator through Telegram.
- Aida warns before heavy Codex usage.
- Aida shows `openclaw models status --plain` output when useful and available.
- Aida asks for explicit approval before:
  - coding
  - writing to repositories
  - deployments
  - deletes
  - long-running tasks

## Security boundary

- Secrets live in `.env`
- Do not commit `.env`
- Keep the Gateway bound to localhost or Tailscale only
- Prefer persistent backups before upgrades

## Runtime note

The actual agent bootstrap files live in `workspace/` so OpenClaw can inject them at runtime without exposing `.env` inside the workspace root.
