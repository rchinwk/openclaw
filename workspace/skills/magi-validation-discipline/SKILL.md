---
name: "magi-validation-discipline"
description: "Validation workflow for Magi project changes; use after approved Magi frontend, backend, engine, Docker, service, trading-system, or UI changes to choose focused checks, rebuild/restart local services when approved and safe, smoke test APIs/UI, inspect health/logs, and report risk."
---

# Magi Validation Discipline

Use this skill for Magi project validation after approved changes or during read-only validation planning.

## Core Rule

Aida validates directly. Do not delegate to other agents.

## Choose Focused Checks

Prefer the smallest set that covers the changed surface:

- Frontend: package manager check, lint/test/build, UI smoke where practical.
- Backend: syntax check, unit/integration tests, API smoke, health endpoint.
- Trading engine: deterministic sample scan, safety flags, real-trading disabled state, gate/economics output sanity.
- Docker/service: build/rebuild, restart, container health, recent logs.
- Database/migrations: migration dry-run/status and rollback plan before applying anything.

## Magi Default Validation Shape

When practical and approved for the scope:

1. Frontend build or relevant test command.
2. Backend syntax check or relevant test command.
3. Docker Compose rebuild/restart for affected local services when safe and approved.
4. Backend/frontend/database health checks where available.
5. Local frontend/API smoke check.
6. Recent service logs after restart.

## Safety

- Do not enable real trading unless the operator explicitly approves that exact action.
- Do not change trading thresholds, risk, SL/TP, timeout, execution mode, exchange keys, or live deployment as part of validation.
- Do not read `.env` contents.
- Do not run destructive database or Docker volume commands without separate approval.

## Final Report

Include:

- Checks run and result.
- Services rebuilt/restarted or not.
- Health/smoke status.
- Real-trading state if relevant.
- Logs inspected and any warnings.
- Residual risk and next recommended check.
