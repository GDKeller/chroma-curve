---
type: task
status: backlog
priority: 1
created: 2026-04-17
parent: EPIC-0015
---

# TASK-0072: Add `pnpm-workspace.yaml` and `packageManager` field

Declare the workspace. This is a pure configuration change — no install yet (that's TASK-0073), no script changes yet (TASK-0074).

## Changes

### `pnpm-workspace.yaml` (new, repo root)

```yaml
packages:
  - app
```

### `package.json` (root) — add field

```json
{
  "packageManager": "pnpm@9.15.0"
}
```

Pin to the current stable pnpm version at migration time (check `https://pnpm.io/` or `pnpm --version` if already installed locally).

### Optional `.npmrc` (root) — recommended defaults

```
# Keep pnpm's strict node_modules layout (the point of switching)
# Do NOT set shamefully-hoist=true unless a dep forces it
engine-strict=true
```

Only add if needed; keep config minimal.

## Not in this task

- Removing `node_modules` or lockfiles (TASK-0073)
- Running `pnpm install` (TASK-0073)
- Migrating scripts (TASK-0074)

## Verification

- [ ] `pnpm-workspace.yaml` exists with `app` listed
- [ ] Root `package.json` has `packageManager` field with a pinned pnpm version
- [ ] Files validate as YAML / JSON respectively
- [ ] No other files modified
