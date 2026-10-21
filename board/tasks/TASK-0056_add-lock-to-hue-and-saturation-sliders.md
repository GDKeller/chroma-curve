---
type: task
status: backlog
priority: 3
parent: EPIC-0014
created: 2026-04-06
updated: 2026-10-20
---

# TASK-0056: Add lock toggle to HueSlider and SaturationSlider

> **Deferred (2026-04-10) — do not pick up.** Pre-emptively locking sliders solves a problem users don't actually have and risks making the controls feel constrained. The real issue EPIC-0014 targets (identity mismatch between input and L50 display) is being addressed by clearer popover presentation and inline multi-format readouts instead. Revisit only if users report accidentally invalidating targets.
>
> *Board note (2026-10-20):* moved from the non-spec `deferred` status to `backlog`, and lowered from priority 1 to 3 so it doesn't sort above live work. The deferral still stands; it is recorded here instead of in a custom status.

Add `targetLocked` and `setTargetLocked` to the store (they don't exist yet), and read them alongside `targetInput`. Show Lock/LockOpen icon (Phosphor, matching LightnessRange pattern) when `targetInput !== null`. Pass `disabled={targetLocked}` to SliderBase (requires TASK-0055). Unlocking allows drift — does not clear target. SaturationSlider also disables satMode toggle when locked.

## Files

- `app/src/store/paletteStore.ts`
- `app/src/components/HueSlider/HueSlider.tsx`
- `app/src/components/SaturationSlider/SaturationSlider.tsx`
