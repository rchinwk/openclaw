---
name: "github-change-discipline"
description: "Confirm before code/project changes, then commit/push."
---

# GitHub Change Discipline

Use this skill whenever making code, configuration, project, or repository changes for the operator.

## Confirmation Before Changes

Before changing any code, configuration, project file, repository file, cron definition, or durable workflow, first ask the operator for explicit confirmation.

- State briefly what will be changed and why.
- Wait for a clear approval before editing files or running write/build/deploy actions that change local or external state.
- Do not treat analysis, read-only inspection, API status checks, log review, or cron status reporting as changes.
- If an urgent safety fix appears necessary, explain the risk and still ask before changing it.
- If the operator has already explicitly said to implement/apply/fix/change in the same turn, that counts as confirmation for the described scope only.

## Default Rule After Approved File Changes

After any approved file change in a Git repository:

1. Inspect `git status --short` from the repository root.
2. Identify exactly which files were changed by this agent in the current task.
3. Do not stage unrelated user or system changes.
4. Run an appropriate validation step before committing when feasible.
5. Commit only the files changed for the task with a concise commit message.
6. Push the commit to the active branch's configured remote.
7. Verify the push by comparing local `HEAD` with the remote ref, for example:
   - `git rev-parse HEAD`
   - `git ls-remote origin refs/heads/<branch>`
8. Report the commit hash, branch, pushed remote, and any remaining unrelated dirty files.

## New Projects

When creating a new project:

1. Ask for confirmation before creating the project files.
2. Check whether it is inside an existing Git repository.
3. If not, initialize Git only when appropriate for the project location.
4. Create a sensible initial commit containing the project files after approval.
5. If no remote exists, report that GitHub cannot be updated until a remote is configured.
6. If a remote exists or the user supplies one, push the initial commit and verify remote hash.

## Safety

- Never include secrets, `.env` files, tokens, private keys, build artifacts, cache directories, or unrelated generated data unless explicitly requested and appropriate.
- Never revert unrelated local changes.
- Ask before pushing to a new public remote or changing repository visibility.
- If push fails, report the exact failure and leave the local commit intact.

## Final Response Checklist

Every change-making response should include one of:

- `Pushed: <commit> to <remote>/<branch>` with verification, or
- `Committed locally but not pushed: <reason>`, or
- `Not committed: <reason>`.

For read-only or analysis-only turns, state that no files were changed when useful.
