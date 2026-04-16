---
type: task
status: done
priority: 2
epic: EPIC-0014
created: 2026-04-06
completed: 2026-04-10
---

# TASK-0058: Add inline multi-format color display in ControlBar

New `TargetFormats` component renders as a horizontal row below the main ControlBar grid when `targetInput !== null`. Four click-to-copy items (hex, rgb, hsl, oklch) showing current working color at L50, preceded by a "TARGET" label that reads "TARGET (DRIFTED)" and dims to opacity-55 when drifted. A top border separates the row from the main controls. Placed inside ControlBar below the main grid rather than next to the swatch so oklch strings don't push other sliders off the row.

## Files

- `app/src/components/controls/TargetFormats.tsx` (new)
- `app/src/components/controls/ControlBar.tsx`
