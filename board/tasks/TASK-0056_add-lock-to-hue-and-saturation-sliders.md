---
type: task
status: deferred
priority: 1
epic: EPIC-0014
created: 2026-04-06
deferred: 2026-04-10
---

# TASK-0056: Add lock toggle to HueSlider and SaturationSlider

**Deferred** — pre-emptively locking sliders solves a problem users don't actually have and risks making the controls feel constrained. The real issue EPIC-0014 targets (identity mismatch between input and L50 display) is being addressed by clearer popover presentation and inline multi-format readouts instead. Revisit only if users report accidentally invalidating targets.

Read `targetLocked`, `targetInput`, and `setTargetLocked` from store. Show Lock/LockOpen icon (Phosphor, matching LightnessRange pattern) when `targetInput !== null`. Pass `disabled={targetLocked}` to SliderBase. Unlocking allows drift — does not clear target. SaturationSlider also disables satMode toggle when locked.

## Files

- `app/src/components/controls/HueSlider.tsx`
- `app/src/components/controls/SaturationSlider.tsx`
