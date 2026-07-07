# Aida on OpenClaw

This directory contains the local deployment assets for `Aida`, an OpenClaw-based AI digital assistant that uses OpenAI Codex OAuth and talks through Telegram.

## What is installed now

- Host install: `openclaw` CLI `2026.6.6`
- Auth: OpenAI OAuth via ChatGPT Plus/Pro account
- Default model: `openai/gpt-5.4`
- Gateway bind: `127.0.0.1:18789`
- Service manager: `systemd --user`
- Telegram mode: DM pairing by default

## File layout

- `.env`: local secrets and runtime env vars
- `.env.example`: placeholder template
- `config/aida.yaml`: source-of-truth persona and safety policy
- `config/usage-limits.yaml`: heavy-usage warning thresholds
- `workspace/AGENTS.md`: runtime behavior guardrails injected into Aida
- `workspace/IDENTITY.md`: Aida identity bootstrap
- `scripts/*.sh`: maintenance helpers
- `docker-compose.yml`: optional containerized deployment template

## Security notes

- Keep `.env` mode `600`
- Do not commit `.env`
- The Gateway stays on `127.0.0.1`
- No public exposure is configured
- Telegram bot token and gateway token are loaded from `.env`
- OpenAI OAuth state is managed by OpenClaw itself, not by `.env`

## Common commands

```bash
export PATH="$HOME/.npm-global/bin:$PATH"
systemctl --user status openclaw-gateway
openclaw models status --plain
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
./scripts/healthcheck.sh
./scripts/backup.sh
./scripts/update.sh
```

## Telegram first-run test

1. Open `https://t.me/aida_Xperiment_bot` on your phone.
2. Send `hello`.
3. Run `openclaw pairing list telegram`.
4. Approve the shown code with `openclaw pairing approve telegram <CODE>`.
5. Send `status` or `who are you?` and confirm Aida replies.

## Optional Docker path

The live install on this host currently uses the user systemd service. `docker-compose.yml` is included as an optional future migration path, not the active runtime.
