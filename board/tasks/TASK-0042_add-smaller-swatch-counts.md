---
type: task
status: backlog
priority: 3
created: 2026-04-01
parent: NOTE-0019
---

# TASK-0042: Add smaller swatch count options (3, 4, 5)

Add 3, 4, and 5 to the `STEP_OPTIONS` array in `PaletteGrid.tsx` so users can generate quick, minimal palettes without the 8+ swatch minimum.

## Requirements

- Prepend `3, 4, 5` to `STEP_OPTIONS` in `app/src/components/palette/PaletteGrid.tsx`
- Verify grid layout (`bestCols`) produces clean results at these counts
- No UI changes beyond the new dropdown options
