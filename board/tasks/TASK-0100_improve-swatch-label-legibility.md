---
type: task
status: backlog
priority: 1
created: 2026-05-06
parent: EPIC-0020
---

# TASK-0100: Improve swatch-label legibility on mid-tone backgrounds

Swatch labels (hex/HSL/OKLCH values) auto-switch between dark and light text based on background lightness, but the L30–70 mid-tone range produces marginal contrast in either direction. The HSL-value type size also drops below comfortable reading at small swatch sizes.

## Acceptance

- Mid-tone backgrounds (L30–70) reach WCAG AA contrast for label text — via text-shadow, a subtle backing pill, or a guaranteed-legible token rather than auto-switch.
- Minimum HSL-value font size raised to a comfortable floor.
- Existing dark/light auto-switch preserved for clear-cut cases.

## Source

- NOTE-0011
