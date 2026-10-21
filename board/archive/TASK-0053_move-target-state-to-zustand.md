---
type: task
status: done
priority: 1
epic: EPIC-0014
created: 2026-04-06
completed: 2026-04-10
---

# TASK-0053: Move target color state from local TargetSwatch state to Zustand store

Add `targetInput`, `targetFormat`, `targetHue`, and `targetSat` fields to `paletteStore.ts`. Add `setTarget()` (sets all fields + applies hue/sat) and `clearTarget()` (nulls all) actions. Remove corresponding `useState` calls from `TargetSwatch.tsx` and wire to store instead. The store lift is necessary so `ControlBar` can render the inline multi-format display (TASK-0058) alongside the swatch without prop drilling or lifting state up later.

## Files

- `app/src/store/paletteStore.ts`
- `app/src/components/controls/TargetSwatch.tsx`
