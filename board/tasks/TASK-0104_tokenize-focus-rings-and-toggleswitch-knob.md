---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0021
---

# TASK-0104: Tokenize focus rings and ToggleSwitch knob

Eliminate hardcoded `ring-white` and ToggleSwitch knob colors in shared components. Introduce a `--color-focus-ring` (or equivalent) semantic token and route all chrome through it.

## Acceptance

- New `--color-focus-ring` semantic token defined in the theme.
- All `ring-white` usages in shared components replaced.
- ToggleSwitch knob color sourced from a token, not a literal.
- Visual regression check across keyboard focus paths confirms parity (or intentional improvement).

## Source

- NOTE-0030
