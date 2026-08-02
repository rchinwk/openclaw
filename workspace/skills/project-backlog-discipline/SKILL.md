---
name: "project-backlog-discipline"
description: "Maintain a central PROJECT_BACKLOG.md for serious projects; use for reviews, audits, bugs, feature requests, implementation work, project planning, and any follow-up that must not disappear into chat history."
---

# Project Backlog Discipline

Use this skill for every serious project moment: reviews, audits, bugs, feature requests, architecture decisions, implementation, validation, "later doen" items, and project planning.

## Central Rule

Every serious project should have one central backlog file at the project root:

`PROJECT_BACKLOG.md`

This file is the durable source for open work. Chat summaries, agent memory, and scattered docs are not enough.

## Ownership

- Aida owns the operator-facing guarantee: backlog exists, important items are captured, and final replies state backlog status.
- Aida must mark backlog-worthy findings explicitly and provide priority, risk/impact, next step, and dependencies.
- Aida must update item status when work starts or completes.
- Aida verifies backlog status before reporting serious project work as complete.

## Required Workflow

1. Identify the project root.
2. Check whether `PROJECT_BACKLOG.md` exists.
3. If it does not exist and the task involves a serious project, propose creating it before writing.
4. For review/audit output, convert durable findings into backlog items.
5. For implementation work, update related items to `In progress`, `Done`, `Dropped`, or leave them `Open` with notes.
6. In the final response, include one compact backlog line:
   - `Project backlog: updated`
   - `Project backlog: already current`
   - `Project backlog: not needed`
   - `Project backlog: approval needed`

## Item Format

Use this format unless the project already has a stronger local convention:

```markdown
### <number>. <Title>

Status: `Open`
Priority: `P0|P1|P2`
Source: `<User|Aida|review|audit|decision>`, `<YYYY-MM-DD>`

Why:
<Why this matters.>

Risk/impact:
<What goes wrong if ignored.>

Next step:
<Smallest concrete next action.>

Dependencies:
<None, or explicit dependency.>
```

When completed, keep the item and change:

```markdown
Status: `Done`
Completed: `<commit hash or decision/date>`
```

## Priority Guide

- `P0`: safety, live-risk, data loss, security, severe operational failure, or misleading output that could cause bad decisions.
- `P1`: architecture correctness, important product behavior, trading logic validity, reliability, or measurable quality gaps.
- `P2`: UX polish, observability improvement, cleanup, documentation, or nice-to-have workflow improvement.

## Existing Backlog Files

If a project already has `docs/open-items.md`, `TODO.md`, or a similar backlog:

- Prefer creating `PROJECT_BACKLOG.md` as the central index/source going forward.
- Either migrate the active items or link to the existing file as a legacy/detail source.
- Do not duplicate large sections blindly when a concise migration or reference is clearer.

## Approval Boundary

Creating or editing `PROJECT_BACKLOG.md` is a repository write. If approval has not already been given for that exact scope, ask first.
