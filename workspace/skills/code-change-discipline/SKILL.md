---
name: "code-change-discipline"
description: "Aida's single-agent coding workflow for approved code, config, repository, dev-service, rebuild, restart, or durable automation changes; use for implementation planning, numbered approvals, small scoped edits, validation, rollback notes, commit/push, and final change reports."
---

# Code Change Discipline

Use this skill whenever Aida is asked to plan or perform code, configuration, repository, dev-service, rebuild, restart, or durable automation changes.

## Core Rule

Aida codes directly. Do not delegate to other agents. Use skills for procedure and keep the operator-facing conversation clean.

## Before Changes

For every change, first give a numbered proposal unless the operator has already approved a concrete scope in the same turn.

Each numbered item must state:

1. What will change.
2. Why it should change.
3. Risk/impact.
4. Dependencies.
5. Validation.
6. Exact approval needed.

The operator may approve individual numbers. Implement only approved numbers. If an approved item depends on an unapproved item, pause and explain.

## Implementation Rules

- Keep changes small and aligned with the existing architecture.
- Be critical of the request: call out hidden risk, unnecessary scope, architecture impact, missing rollback, and safer alternatives.
- Avoid unrelated refactors, metadata churn, generated artifacts, secrets, runtime state, and unrelated dirty files.
- Confirm project path, intended files/areas, validation expectations, commit/push expectation, and restart expectation before acting when ambiguous.
- Pause before secrets, `.env`, deletes, public exposure, production deploys, database/schema migrations, paid/external services, or long-running tasks.

## After Approved Implementation

1. Run focused validation: tests, build, syntax checks, health checks, or the closest practical equivalent.
2. Use `github-change-discipline` for staging, commit, push, and remote verification.
3. Rebuild/restart local services only when approved, safe, and clearly supported by the project.
4. Update project notes or memory when the change materially affects future work.
5. Use `project-backlog-discipline` for serious project work.
6. Use `codex-limit-after-code-changes` before the final response.

## Final Report

Include:

- What changed and why.
- Files touched.
- Validation result.
- Commit/push hash and remote verification, or why not pushed.
- Rebuild/restart status when relevant.
- Risk/caveat and rollback command when useful.
- Memory/project-notes status.
- Project backlog status.
- Unrelated dirty files left untouched.
