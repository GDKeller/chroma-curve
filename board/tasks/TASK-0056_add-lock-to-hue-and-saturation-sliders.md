---
type: task
status: backlog
priority: 1
epic: EPIC-0014
created: 2026-04-06
---

# TASK-0056: Add lock toggle to HueSlider and SaturationSlider

Read `targetLocked`, `targetInput`, and `setTargetLocked` from store. Show Lock/LockOpen icon (Phosphor, matching LightnessRange pattern) when `targetInput !== null`. Pass `disabled={targetLocked}` to SliderBase. Unlocking allows drift — does not clear target. SaturationSlider also disables satMode toggle when locked.

## Files

- `app/src/components/controls/HueSlider.tsx`
- `app/src/components/controls/SaturationSlider.tsx`
