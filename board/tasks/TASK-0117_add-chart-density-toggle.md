---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0007
---

# TASK-0117: Add chart density toggle (swatch-only vs all-steps)

The SaturationCurve and EffectiveSaturation charts always render dots at every L step (5, 6, 7, …, 95). Add a toggle to switch between "all steps" (current) and "swatches only" (one dot per palette swatch). When all-steps is shown, visually emphasize the swatch-aligned dots.

## Acceptance

- Toggle on each chart panel (icon button or small selector) switches density.
- All-steps mode visibly emphasizes swatch dots (larger or brighter) over interstitials.
- Default density: TBD during implementation (probably swatch-only for clarity).
- State persists per session.

## Source

- NOTE-0024

## Sequencing

Land after EPIC-0007's chart-rendering migration to OKLCH so we don't refactor twice.
