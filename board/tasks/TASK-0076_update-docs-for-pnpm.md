---
type: task
status: backlog
priority: 2
created: 2026-04-17
parent: EPIC-0015
blocked_by: TASK-0074
---

# TASK-0076: Update docs to reference pnpm

Swap npm references in human-facing docs to pnpm. Keep scope tight — do not rewrite in-flight board docs that happen to mention npm (e.g., TASK-0060's `npm create astro@latest`) unless that work is also being migrated in the same PR.

## Files to audit and update

### `README.md`

Any setup / dev instructions (`npm install`, `npm run dev`, etc.) → `pnpm install`, `pnpm run dev`.

### `.claude/CLAUDE.md` — Commands section

```md
cd app
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build
npm run lint     # ESLint
```

Becomes:

```md
pnpm run dev      # Vite dev server (root) — also: pnpm -F app dev
pnpm run build    # tsc -b && vite build
pnpm run lint     # ESLint
```

Emphasize that root-level invocation is now preferred — no `cd app` needed.

### Board docs (scan, don't bulk-edit)

```bash
rg -l 'npm (run|install)' board/
```

Review hits. For **active/backlog** tasks that reference npm commands in their steps, update inline. For **archived/done** tasks, leave historical references intact.

Known hits likely to appear:

- `board/tasks/TASK-0060_scaffold-astro-project.md` — `npm create astro@latest` command. Update to `pnpm create astro@latest` and adjust the `cd app-astro && npm install` step. (EPIC-0013 is not yet in flight but this task blocks the migration of it.)
- `board/tasks/TASK-0061` through `TASK-0071` — scan for any `npm run` references in the Astro epic tasks.

## Not in this task

- Rewriting historical session notes under `.specstory/history/`
- Regenerating lockfiles (already done in TASK-0073)
- Adding `.nvmrc` / `engines` (NOTE-0030 item, separate follow-up)

## Verification

- [ ] `rg 'npm (install|run|ci)' README.md .claude/CLAUDE.md` returns nothing
- [ ] `rg 'npm (install|run|ci)' board/tasks board/planning` — remaining hits are in clearly-historical contexts (done/archived) or intentionally left (explain in PR)
- [ ] A fresh reader following README instructions can clone, `pnpm install`, and `pnpm run dev` successfully
