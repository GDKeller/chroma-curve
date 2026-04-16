---
type: task
status: done
priority: 2
epic: EPIC-0014
created: 2026-04-06
completed: 2026-04-10
---

# TASK-0054: Add formatAllFormats() utility to colors.ts

New function returning `{ hex, rgb, hsl, oklch }` strings for a given hue/sat at L50. Composes existing `formatTargetColor()` and `toOklchString()` logic.

## Files

- `app/src/lib/colors.ts`
