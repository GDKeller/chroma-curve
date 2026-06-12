---
type: task
status: backlog
priority: 1
created: 2026-04-17
parent: EPIC-0015
blocked_by: TASK-0073
---

# TASK-0074: Migrate root `package.json` scripts to `pnpm --filter`

Replace every `npm run --prefix app <cmd>` with `pnpm -F app <cmd>` in root `package.json`.

## Current

```json
{
  "scripts": {
    "build": "npm run --prefix app build",
    "verify": "npm run --prefix app verify",
    "verify:fix": "npm run --prefix app verify:fix",
    "verify:strict": "npm run --prefix app verify:strict",
    "deploy": "npm run --prefix app build && wrangler pages deploy",
    "dev": "./scripts/dev.sh",
    "dev:app": "npm run --prefix app dev",
    "format": "npm run --prefix app format",
    "format:fix": "npm run --prefix app format:fix",
    "knip": "npm run --prefix app knip",
    "knip:fix": "npm run --prefix app knip:fix",
    "lint": "npm run --prefix app lint",
    "lint:fix": "npm run --prefix app lint:fix",
    "log": "./scripts/log.sh watch",
    "log:tail": "./scripts/log.sh tail",
    "preview": "npm run --prefix app preview",
    "status": "./scripts/status.sh",
    "stop": "./scripts/stop.sh",
    "typecheck": "npm run --prefix app typecheck"
  }
}
```

## Target

```json
{
  "scripts": {
    "build": "pnpm -F app build",
    "verify": "pnpm -F app verify",
    "verify:fix": "pnpm -F app verify:fix",
    "verify:strict": "pnpm -F app verify:strict",
    "deploy": "pnpm -F app build && wrangler pages deploy",
    "dev": "./scripts/dev.sh",
    "dev:app": "pnpm -F app dev",
    "format": "pnpm -F app format",
    "format:fix": "pnpm -F app format:fix",
    "knip": "pnpm -F app knip",
    "knip:fix": "pnpm -F app knip:fix",
    "lint": "pnpm -F app lint",
    "lint:fix": "pnpm -F app lint:fix",
    "log": "./scripts/log.sh watch",
    "log:tail": "./scripts/log.sh tail",
    "preview": "pnpm -F app preview",
    "status": "./scripts/status.sh",
    "stop": "./scripts/stop.sh",
    "typecheck": "pnpm -F app typecheck"
  }
}
```

Notes:

- `pnpm -F <name>` is equivalent to `pnpm --filter <name>`. Prefer the short form for consistency.
- The `name` used by `-F` is the `name` field in `app/package.json` — currently `"chroma-curve"`. **Verify:** the filter target should match the workspace package name, not the directory. Either rename the filter to `pnpm -F chroma-curve …` OR change `app/package.json`'s `name` to `app`. Prefer the latter (`"name": "app"`) so the filter alias matches the directory and the marketing name `chroma-curve` lives only in the deployed artifact.
- Shell-script invocations (`./scripts/dev.sh` etc.) stay unchanged in this task — internal `npm run` calls inside those scripts are handled in TASK-0075.

## Verification

- [ ] Root `package.json` contains zero `npm run` occurrences
- [ ] `pnpm run build`, `pnpm run verify`, `pnpm run lint`, `pnpm run typecheck` all succeed
- [ ] `pnpm run dev` starts the dev server (via `scripts/dev.sh`, which still works because scripts are updated in TASK-0075 — if scheduling TASK-0074 and TASK-0075 independently, either sequence works but `dev` won't be exercisable until both land)
- [ ] Workspace package name matches the `-F` filter (either app renamed, or filter updated)
