---
type: task
status: done
priority: 2
created: 2026-11-04
updated: 2026-11-04
parent: EPIC-0017
---

# TASK-0131: Default swatch count to 9

`PaletteGrid` initializes `swatchCount` to 8 (`useState<number>(8)` in `app/src/components/PaletteGrid/PaletteGrid.tsx`). Change the default to 9. An odd count puts a swatch on the L50 midpoint (the curve's vertex) and gives an evenly spaced scale.

## Acceptance

- Initial swatch count is 9; `9` is already in `STEP_OPTIONS`.
- Grid layouts (`bestCols`) still produce a clean arrangement at 9.
