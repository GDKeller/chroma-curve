---
type: epic
status: planning
created: 2026-04-17
---

# EPIC-0015: Migrate tooling to pnpm workspaces

Replace npm with pnpm and declare a workspace at repo root. Root `package.json` becomes a proper workspace manifest; `app/` becomes the first of (eventually) several packages. Unblocks EPIC-0013 (Astro `site/` package) and future sibling packages without a second lockfile or duplicated installs.

See **NOTE-0033** for the full plan, rationale, and gotchas.

## Goals

- Single `pnpm-lock.yaml` at root; no per-package lockfiles.
- Root scripts use `pnpm -F app <cmd>` instead of `npm run --prefix app <cmd>`.
- All shell scripts under `scripts/` invoke `pnpm` instead of `npm`.
- Package manager pinned via `packageManager` field; Corepack-ready.
- End-to-end workflow (dev, build, verify, deploy) verified on pnpm before merge.

## Scope

- Declare workspace (`pnpm-workspace.yaml`, `packageManager` field).
- Reset npm state (`node_modules`, both `package-lock.json` files) and reinstall under pnpm.
- Migrate root `package.json` scripts to `pnpm --filter` syntax.
- Update `scripts/*.sh` (`run-all.sh`, `run-sequential.sh`, `dev.sh`) to call `pnpm`.
- Update docs (`README.md`, `.claude/CLAUDE.md`) to reference pnpm commands.
- Verify dev server, build, verify, and `wrangler pages deploy` all work under pnpm.

## Deferred / out of scope

- Splitting `app/` into sub-packages — premature.
- Adding `site/` (Astro) package — lives in EPIC-0013; this epic only enables it.
- `.nvmrc` / `engines` field — noted in NOTE-0030, bundle separately.
- CI config (GitHub Actions etc.) — none currently configured; if added later, use `pnpm`.

## Tasks

- TASK-0072: Add `pnpm-workspace.yaml` and `packageManager` field
- TASK-0073: Reset npm state and reinstall with pnpm
- TASK-0074: Migrate root `package.json` scripts to `pnpm --filter`
- TASK-0075: Migrate shell scripts to invoke pnpm
- TASK-0076: Update docs to reference pnpm commands
- TASK-0077: Verify full pipeline (dev, build, verify, deploy) under pnpm

## Related

- NOTE-0033 — full migration plan
- EPIC-0013 — Astro migration (consumes workspaces once landed)
- NOTE-0030 — adjacent `.nvmrc` / `engines` cleanup
