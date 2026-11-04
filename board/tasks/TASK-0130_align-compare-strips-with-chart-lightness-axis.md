---
type: task
status: backlog
priority: 2
created: 2026-11-04
parent: EPIC-0020
---

# TASK-0130: Align Compare strips with the chart's lightness axis

The Saturation Curve chart plots lightness 0 → 100 left to right, but the Unadjusted and Adjusted strips in the Compare disclosure directly below it run white → black (100 → 0). Reading the strip against the curve above it requires mentally flipping one of them, which breaks the "show the math" link between the two.

## Cause

`generateNeutrals()` (`app/src/lib/palette.ts`) returns entries light → dark (`entries.reverse()`). `ChartTabs` (`app/src/components/ChartTabs/ChartTabs.tsx`) maps `entries` straight into both strips, so they inherit that order. `PaletteStrip` already reverses the entries locally for its own dark → light display.

## Acceptance

- Both Compare strips run dark → light (L0 on the left), matching the chart's x-axis.
- Fix lives in `ChartTabs` (reverse locally, as `PaletteStrip` does); `generateNeutrals()` output order is unchanged, since `PaletteGrid`, export, and others depend on it.
- Decide whether the strips should also span the chart's full 0–100 axis when `lMin`/`lMax` narrow the range (currently they cover only `lMin..lMax`, so they no longer line up with the axis ticks). Options: pad/offset the strip to the plotted range, or leave as-is and accept a stretched strip.

## Related

- TASK-0099 — Make Compare disclosure visible (same component, natural to pair)
- TASK-0083 — unadjusted reference strip
