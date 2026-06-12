---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0019
---

# TASK-0092: Implement contrast-ratio and ΔE metrics utility

Single utility module exporting WCAG contrast ratio and ΔE2000 perceptual distance, built on culori (post-EPIC-0009).

## Acceptance

- `app/src/lib/metrics.ts` (or similar) exports:
  - `contrastRatio(a, b)` — WCAG ratio, 1–21.
  - `wcagLevel(ratio, fontSize)` — returns `"AAA" | "AA" | "fail"` for normal/large text.
  - `deltaE2000(a, b)` — perceptual distance.
- Inputs accept any culori-parseable color form.
- Unit tests covering known reference pairs (e.g., black/white = 21, identical colors = 1 / ΔE = 0).

## Source

- NOTE-0002, NOTE-0004
