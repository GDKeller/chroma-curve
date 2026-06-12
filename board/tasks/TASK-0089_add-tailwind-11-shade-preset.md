---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0018
blocked_by:
  - TASK-0087
  - TASK-0088
---

# TASK-0089: Add Tailwind 11-shade preset

Add a "11 (Tailwind)" option to the swatch-count selector that maps to Tailwind's `50, 100, …, 900, 950` scale with appropriate lightness distribution and shade-number labels.

## Acceptance

- New "11 (Tailwind)" entry in the swatch-count selector, with tooltip explaining the mapping.
- Lightness distribution decision per TASK-0087 (locked Tailwind L curve vs. equal-distribution).
- Swatches display Tailwind shade numbers when preset is active.
- CSS export emits `--color-gray-50` … `--color-gray-950` named custom properties (or palette-named per export config).

## Source

- NOTE-0031
