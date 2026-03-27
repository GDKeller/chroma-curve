---
type: task
created: 2026-03-16
status: done
epic: EPIC-0004
priority: medium
refs: [CQ-4]
---

# Refactor useCurvePickerVisuals to return data, not JSX

The `useCurvePickerVisuals` hook in `About.tsx` returns JSX elements (`curveGraph`, `rotatedPicker`). Hooks should return data; components should render. This makes the hook untestable and prevents memoization of returned JSX.

## Requirements

- Extract the two returned JSX blocks into proper components (e.g., `CurveGraph` and `RotatedPicker`)
- Have the hook return computed data (paths, cells, coordinates) that the components consume as props
- Or eliminate the hook entirely and move the computation into the components themselves

## Files to modify

- `app/src/components/About.tsx`
