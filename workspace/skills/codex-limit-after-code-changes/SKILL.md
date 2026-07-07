---
name: "codex-limit-after-code-changes"
description: "Report Codex remaining limit after code edits."
---

# Codex Limit After Code Changes

Use after making code or project-file changes for the user.

## Workflow

1. Complete the requested code change and normal verification first.
2. Before the final response, call the available OpenClaw session status tool for the current session when available.
3. Include a short `Codex limit` line in the final answer with remaining short-window and weekly usage, for example: `Codex limit: 5h 87% left, week 97% left`.
4. If the status tool is unavailable or does not expose limits, say `Codex limit: onbekend` instead of guessing.
5. Do not add the limit line for non-code chat unless the user asks.

## Notes

- Keep the line compact; the user only wants the remaining limit after code changes.
- If no files were changed, report status only when it helps explain why no change was made.
