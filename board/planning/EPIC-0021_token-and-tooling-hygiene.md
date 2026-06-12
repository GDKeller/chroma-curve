---
type: epic
status: planning
created: 2026-05-06
---

# EPIC-0021: Token & tooling hygiene

Cross-cutting cleanup surfaced during PR #5 review that doesn't belong with any feature EPIC: tokenization gaps in shared chrome, environment-tooling drift, missing CI wiring for the contrast audit, and reconciliation of the design-token documentation in CLAUDE.md.

## Goals

- Eliminate hardcoded color/ring values in shared components — all chrome routes through tokens.
- Single source of truth for environment values (port number, Node version), no duplicated state.
- Wire the existing contrast-audit script into the lint/CI pipeline so token contrast regressions can't ship.

## Tasks

- TASK-0104 — Tokenize focus rings and ToggleSwitch knob
- TASK-0105 — Reconcile port number to a single source of truth
- TASK-0106 — Tooling hygiene pass (.nvmrc, ESLint globs, contrast-audit wiring, CLAUDE.md docs)

## Source NOTEs

- NOTE-0030 — PR #5 review follow-ups (cross-cutting half; target-color half lives in EPIC-0014)

## Related

- EPIC-0015 — pnpm workspaces migration coordinates with `.nvmrc`/`packageManager` work.
