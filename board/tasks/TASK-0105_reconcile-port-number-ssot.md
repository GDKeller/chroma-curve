---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0021
---

# TASK-0105: Reconcile port number to a single source of truth

The dev-server port number is duplicated across multiple config files. Pick one canonical location and have everything else read from it (env var, config import, or shell script source).

## Acceptance

- One source of truth for the dev-server port.
- Vite config, any shell scripts, and any docs reference that single source.
- Changing the port in one place updates everywhere with no further edits.

## Source

- NOTE-0030
