---
type: task
status: backlog
priority: 1
created: 2026-04-17
parent: EPIC-0015
blocked_by: TASK-0072
---

# TASK-0073: Reset npm state and reinstall with pnpm

Remove all npm-era install artifacts and generate a single unified `pnpm-lock.yaml` at the repo root.

## Steps

From repo root:

```bash
rm -rf node_modules app/node_modules
rm -f package-lock.json app/package-lock.json
pnpm install
```

Expected result:

- New `pnpm-lock.yaml` at repo root (committed)
- `node_modules/` at root with pnpm's symlinked layout (`.pnpm/` virtual store)
- `app/node_modules/` containing only direct-dep links into the root store
- No `package-lock.json` anywhere in the tree

## If `pnpm` is not installed locally

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

(Corepack ships with Node 16.10+.) The `packageManager` field from TASK-0072 then pins the version.

## Sanity checks

- `pnpm list --depth 0` in repo root shows workspace packages (`app`)
- `pnpm list --depth 0 -F app` shows the app's direct deps
- `ls app/node_modules | head` shows symlinks (arrows in `ls -la`), not real directories

## Not in this task

- Running the app — scripts still reference `npm run --prefix app`, so `pnpm run dev` won't fully work yet until TASK-0074 lands. Verifying `pnpm -F app dev` directly is fine here.

## Verification

- [ ] `pnpm-lock.yaml` exists at repo root
- [ ] No `package-lock.json` remains anywhere
- [ ] `pnpm install` completes without warnings about missing peers or unmet requirements
- [ ] `pnpm -F app dev` starts the Vite dev server on the expected port (confirms hoisting worked)
- [ ] `pnpm -F app build` produces `app/dist/` (confirms TypeScript + Vite can resolve all deps under pnpm's strict layout)
