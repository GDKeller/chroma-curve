---
type: task
status: backlog
priority: 1
epic: EPIC-0014
created: 2026-04-06
---

# TASK-0053: Move target color state from local TargetSwatch state to Zustand store

Add `targetInput`, `targetFormat`, `targetHue`, `targetSat`, and `targetLocked` fields to `paletteStore.ts`. Add `setTarget()` (sets all fields + applies hue/sat + auto-locks), `clearTarget()` (nulls all + unlocks), and `setTargetLocked()` actions. Remove corresponding `useState` calls from `TargetSwatch.tsx` and wire to store instead.

## Files

- `app/src/store/paletteStore.ts`
- `app/src/components/controls/TargetSwatch.tsx`
