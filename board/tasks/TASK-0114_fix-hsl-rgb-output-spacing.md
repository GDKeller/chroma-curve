---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0014
---

# TASK-0114: Fix HSL/RGB output formatting in lib/colors.ts

Output formatting for HSL and RGB lacks spaces after commas (`hsl(180,50%,50%)` instead of `hsl(180, 50%, 50%)`). The compact form pastes awkwardly into stylesheets and reads as machine-generated.

## Acceptance

- `formatHsl()` and `formatRgb()` (or equivalents) emit `hsl(180, 50%, 50%)` and `rgb(64, 128, 192)` with spaces after commas.
- Existing format consumers (display, copy, export) all pick up the new spacing.
- No regression in copy round-tripping (paste back into the input parses correctly).

## Source

- NOTE-0030
