---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0021
---

# TASK-0106: Tooling hygiene pass

Bundle of small tooling-environment fixes from the PR #5 review.

## Scope

- **`.nvmrc` / `engines`**: pin Node version for the project; coordinate with `packageManager` field landing in EPIC-0015.
- **Dead ESLint globs**: remove ignore patterns and includes that reference paths no longer present.
- **Wire `contrast-audit.mjs` into the lint/CI pipeline**: the script exists but isn't run automatically. Add to `npm run lint` (or a sibling task) and CI.
- **Run `lint:fix`** across the repo to clear accumulated minor warnings.
- **Reconcile CLAUDE.md token docs**: ensure documented tokens match the actual `@theme` block.
- **Prettier ignores `app/dist`**: `npm run verify` fails its format check whenever a build output exists. Prettier runs from `app/`, and the only `.gitignore` is at the repo root, which Prettier doesn't read from `app/`. There is also no `app/.prettierignore`. Add `app/.prettierignore` containing `dist/`. *(Added 2026-10-30 from the 3e17daa review.)*

## Acceptance

- Each scope item lands or is explicitly deferred with a follow-up task.
- CI runs the contrast audit on every PR.
- `npm run lint` is clean after the fixup pass.

## Source

- NOTE-0030

## Related

- EPIC-0015 — pnpm migration; coordinate `packageManager` and Node-version pinning.
