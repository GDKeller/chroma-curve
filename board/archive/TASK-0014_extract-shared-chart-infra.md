---
type: task
created: 2026-03-16
status: done
epic: EPIC-0004
priority: 2
refs: [CQ-5]
---

# Extract shared chart infrastructure from curve components

`SaturationCurve.tsx` and `EffectiveSaturation.tsx` share identical constants (`W`, `H`, `PAD`, `PLOT_W`, `PLOT_H`), identical `toSvgX`/`toSvgY` coordinate transforms, and identical SVG grid/axis rendering markup (~80 lines each).

## Requirements

- Create shared constants in a `curves/chartConstants.ts` or similar
- Create a `useChartCoords(width, height, padding)` hook returning `toSvgX`, `toSvgY`
- Consider a `<ChartContainer>` component that renders the common SVG grid, axes, and labels
- Replace duplicated code in both curve components with the shared abstractions

## Files to modify

- `app/src/components/curves/chartConstants.ts` (new)
- `app/src/components/curves/SaturationCurve.tsx`
- `app/src/components/curves/EffectiveSaturation.tsx`
