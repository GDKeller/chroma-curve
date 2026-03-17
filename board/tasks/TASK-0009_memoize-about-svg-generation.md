---
type: task
created: 2026-03-16
status: done
epic: EPIC-0003
priority: medium
refs: [CQ-8, CQ-9]
---

# Memoize heavy SVG generation in About.tsx

`ColorPickerPlane` builds 1600 `<rect>` elements plus 40 Framer Motion boundary cells on every render. `useCurvePickerVisuals` builds another 1600 picker cells. Both recompute on every hue change during drag (continuous pointer events).

## Requirements

- Wrap `ColorPickerPlane`'s cell arrays (`cells`, `boundaryCells`, `curveDots`, `curvePoints`) in `useMemo` keyed on `hue`
- Wrap `useCurvePickerVisuals`'s `pickerCells`, `curveData`, and path computations in `useMemo` keyed on `hue`
- Consider `React.memo` on `ColorPickerPlane` component itself
- Profile before/after to verify improvement (optional but recommended)

## Files to modify

- `app/src/components/About.tsx`
