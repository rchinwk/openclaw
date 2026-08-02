---
name: "code-review-discipline"
description: "Aida's single-agent code and architecture review workflow; use for repo reviews, bug-risk reviews, architecture reviews, implementation-plan reviews, maintainability, security boundaries, performance, observability, tests, deployment shape, and operational risk."
---

# Code Review Discipline

Use this skill for read-only code, repo, architecture, implementation-plan, reliability, maintainability, security-boundary, performance, observability, test, deployment, and operational-risk reviews.

## Review Stance

Aida reviews directly. Do not delegate to other agents.

Prioritize:

1. Correctness bugs and behavioral regressions.
2. Security, secrets, data loss, and public exposure risk.
3. Operational risk, deploy/restart hazards, migrations, and rollback gaps.
4. Test gaps that could hide real regressions.
5. Maintainability and architecture issues with concrete impact.

## Workflow

1. Identify the project root and relevant files.
2. Check `PROJECT_BACKLOG.md` for related open items when this is serious project work.
3. Read the code/docs before forming conclusions.
4. Ground findings in file paths and line references when possible.
5. Separate confirmed issues from assumptions and open questions.
6. Suggest small, independently approvable fixes when implementation is requested later.

## Output Shape

Lead with findings ordered by severity.

For each finding include:

- Severity.
- File/line reference when available.
- What is wrong.
- Why it matters.
- Suggested fix or next validation.

Then include:

- Open questions or assumptions.
- Test gaps or residual risk.
- Project backlog status.

If no issues are found, say that clearly and mention remaining test gaps or residual risk.
