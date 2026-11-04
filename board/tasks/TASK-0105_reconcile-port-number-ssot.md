---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0021
---

# TASK-0105: Reconcile port number to a single source of truth

The dev-server port number is duplicated across multiple config files. Pick one canonical location and have everything else read from it (env var, config import, or shell script source).

## Progress (2026-11-04)

Mostly done.

- **Done:** `PORT` lives in `app/.env.development.local`. `app/vite.config.ts` reads it via `loadEnv`, and `scripts/config.sh` sources the same file.
- **Remaining:** the `5173` fallback is still hardcoded in both readers: `app/vite.config.ts:37` (`Number(env.PORT) || 5173`) and `scripts/config.sh:7` (`${PORT:-5173}`). Move the default to one place, e.g. a committed `app/.env.development` that both read, with `.local` overriding.

## Acceptance

- One source of truth for the dev-server port.
- Vite config, any shell scripts, and any docs reference that single source.
- Changing the port in one place updates everywhere with no further edits.

## Source

- NOTE-0030
