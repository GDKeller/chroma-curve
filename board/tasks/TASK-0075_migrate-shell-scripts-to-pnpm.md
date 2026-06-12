---
type: task
status: backlog
priority: 1
created: 2026-04-17
parent: EPIC-0015
blocked_by: TASK-0073
---

# TASK-0075: Migrate shell scripts to invoke pnpm

Three scripts in `scripts/` shell out to `npm run`. Swap them to `pnpm run`.

## Files

### `scripts/run-all.sh`

```bash
# before
npm run "$task" || failed=1
# after
pnpm run "$task" || failed=1
```

### `scripts/run-sequential.sh`

```bash
# before
npm run "$task"
# after
pnpm run "$task"
```

### `scripts/dev.sh`

```bash
# before
npm run dev:app > "$DEV_LOG" 2>&1 &
# after
pnpm run dev:app > "$DEV_LOG" 2>&1 &
```

## Notes

- Both `run-all.sh` and `run-sequential.sh` are invoked *from* `app/` as `bash ../scripts/run-all.sh lint format knip typecheck` (see `app/package.json` `verify` script). Their cwd at execution is `app/`, so `pnpm run <task>` resolves to the app-workspace's scripts — no need for `-F app`.
- `dev.sh` runs from repo root; `pnpm run dev:app` resolves via the root `package.json` (updated in TASK-0074).

## Grep check

```bash
rg '\bnpm\b' scripts/
```

Should return nothing after this task (except comments, if any). Confirm no stray `npm install`, `npx`, etc.

## Verification

- [ ] No `npm` invocations remain in `scripts/*.sh` (modulo comments)
- [ ] `pnpm run verify` works — exercises `run-all.sh` via `app/`'s `verify` script
- [ ] `pnpm run verify:strict` works — exercises `run-sequential.sh`
- [ ] `pnpm run dev` starts the dev server and writes to `logs/dev.log`
