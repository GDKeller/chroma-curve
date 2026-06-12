---
type: task
status: backlog
priority: 1
created: 2026-04-17
parent: EPIC-0015
blocked_by: TASK-0074, TASK-0075
---

# TASK-0077: Verify full pipeline under pnpm

End-to-end smoke test before merging the pnpm migration. Every developer-facing and deploy-facing workflow must work.

## Checklist

Run from repo root unless noted.

### Dev loop

- [ ] `pnpm install` from a clean clone (delete `node_modules/` + `pnpm-lock.yaml` locally, reinstall) succeeds
- [ ] `pnpm run dev` starts Vite on the expected port (`$PORT` or 5173), logs to `logs/dev.log`
- [ ] Hot reload works — edit a component, see the change in the browser
- [ ] `pnpm run stop` kills the dev server cleanly
- [ ] `pnpm run log` / `pnpm run log:tail` work (shell scripts unchanged, but confirm cwd resolution)

### Quality gates

- [ ] `pnpm run lint` — ESLint passes (or reports existing warnings only)
- [ ] `pnpm run typecheck` — `tsc -b --noEmit` passes
- [ ] `pnpm run format` — Prettier check passes
- [ ] `pnpm run knip` — no new dead-code warnings introduced by the migration
- [ ] `pnpm run verify` — composite passes (exercises `run-all.sh`)
- [ ] `pnpm run verify:strict` — sequential composite passes (exercises `run-sequential.sh`)

### Build + deploy

- [ ] `pnpm run build` — produces `app/dist/` with expected bundles
- [ ] `pnpm run preview` — serves the built app locally, renders correctly
- [ ] `pnpm run deploy` — dry-run via `--dry-run` flag on wrangler, OR perform a real deploy to a preview environment. Verify `wrangler pages deploy` picks up `app/dist` correctly.

### Cloudflare Pages CI (if connected)

- [ ] Confirm CF Pages project build settings detect pnpm (via `packageManager` + `pnpm-lock.yaml`)
- [ ] Push the migration branch; verify the Pages preview build succeeds
- [ ] Build output matches local `pnpm run build`

### Editor / tooling sanity

- [ ] Reload VSCode after install; TypeScript server resolves imports correctly
- [ ] ESLint extension finds config and reports correctly
- [ ] No red squigglies on imports that worked pre-migration

## Rollback plan

If anything above fails and the cause can't be resolved inside a 30-minute window:

```bash
git checkout main -- package.json app/package.json
rm -rf pnpm-workspace.yaml pnpm-lock.yaml node_modules app/node_modules
npm install
```

The branch stays on disk for later revival. Open an issue / follow-up note capturing what broke.

## Verification

- [ ] All checklist items above pass
- [ ] PR description captures any observed non-fatal warnings (especially peer-dep warnings from pnpm's stricter resolution)
- [ ] Reviewer can reproduce the green checklist on a fresh clone
