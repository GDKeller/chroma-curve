---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0014
---

# TASK-0110: Tokenize hardcoded colors in target-color components

Eliminate hardcoded color values in target-color components flagged in PR #5 review.

## Scope

- `text-white` in FormatSelector → `text-text-primary` (or appropriate token).
- `rgba(...)` boxShadow in TargetSwatch → token-based shadow.
- Any other literal color values in TargetSwatch, ColorInput, TargetFormats, FormatSelector.

## Acceptance

- Grep for `text-white`, `rgba(`, hex literals, hsl literals across `app/src/components/target/**` returns no offenders.
- Visual parity preserved (or intentional improvement noted).

## Source

- NOTE-0030
