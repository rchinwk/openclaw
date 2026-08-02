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

Start every code-change proposal with a project line:

`Project: <project name> (<absolute project path>)`

If the project is not yet known, identify it before proposing changes or state the assumption clearly.

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
- For serious project work, check the project backlog before editing and keep it current as part of the same change. Add missing backlog items for discovered follow-ups, update active/completed item status, or record why no backlog change is needed.

## TradingView / Lightweight Charts Rule

When working on TradingView-like charts built with `lightweight-charts`, do not force complex visual overlays into chart series or price-scale labels when the requested result needs TradingView-style subtle zones, exact label placement, or rich overlay composition.

Default to the proven project pattern used in Magi-15:

- keep candles, indicators, and true price lines in `lightweight-charts`;
- draw visual inspection overlays with a transparent SVG layer above the chart;
- use chart coordinate helpers such as `timeToCoordinate` and `priceToCoordinate` to align SVG shapes to candles/prices;
- keep Support/Resistance and realtime price on the right price scale when requested;
- draw liquidity, FVG, order blocks, supply/demand, volume profile, and similar inspection labels inside the SVG overlay so they can stay subtle and off the price scale.

If an existing project already has a better chart-overlay convention, follow that local convention. Otherwise, strongly prefer an SVG overlay layer for advanced TradingView-like overlays.

## After Approved Implementation

1. Run focused validation: tests, build, syntax checks, health checks, or the closest practical equivalent.
2. Use `github-change-discipline` for staging, commit, push, and remote verification.
3. Rebuild/restart local services only when approved, safe, and clearly supported by the project.
4. Update project notes or memory when the change materially affects future work.
5. Use `project-backlog-discipline` for serious project work. Do not report the work complete until the project backlog has been updated, verified already current, marked not needed with a reason, or blocked pending approval.
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
