---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0007
---

# TASK-0117: Add chart density toggle (swatch-only vs all-steps)

The SaturationCurve and EffectiveSaturation charts render dots at every L step in `lMin..lMax` (default 0–100, so 101 dots) whenever the `steps` toggle is on. Add a toggle to switch between "all steps" (current) and "swatches only" (one dot per palette swatch). When all-steps is shown, visually emphasize the swatch-aligned dots.

## Acceptance

- Toggle switches density. The existing `steps` `ToggleSwitch` in `ChartTabs` already controls dot visibility (`showDots`, shared by both charts, rendered in `LightnessChart`). Either turn it into a three-way selector (off / swatches / all) or add a second control next to it. Keep one shared control rather than one per chart panel, since both charts already share `showDots`.
- "Swatches only" dots match exactly the swatches `PaletteGrid` displays (same `sampleEntries` result), and update when the swatch count changes. `swatchCount` is local to `PaletteGrid` today, so it must be lifted first; see TASK-0132, which needs the same lifted state.
- All-steps mode visibly emphasizes swatch dots (larger or brighter) over interstitials.
- Default density: TBD during implementation (probably swatch-only for clarity).
- State persists per session.

## Source

- NOTE-0024
- User request 2026-11-04: show only the visible swatches as steps, possibly as an additional toggle.

## Sequencing

Land after EPIC-0007's chart-rendering migration to OKLCH so we don't refactor twice.
