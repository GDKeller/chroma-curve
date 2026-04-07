---
type: epic
status: planning
created: 2026-04-06
---

# EPIC-0014: Target color input UX refinements

Users enter a color (e.g., `#FF5733`) into the target picker, but the app extracts only hue + saturation and forces lightness to 50%. The swatch then shows a different hex value, which is confusing. The "H+S at L50" explanation is small and buried inside a popover with no persistent indicator. Moving hue/sat sliders silently invalidates the target without warning.

## Goals

- Make the L50 normalization obvious with clear before/after display
- Show a persistent "target active" indicator outside the popover
- Lock hue/sat sliders when a target is set to prevent accidental invalidation
- Display the working color in all four formats (hex, rgb, hsl, oklch) inline
- Support a "drift" model: unlocking sliders keeps target indicator in a stale state

## Scope

- **Move target state to Zustand** — target fields (`targetInput`, `targetFormat`, `targetHue`, `targetSat`, `targetLocked`) move from local TargetSwatch state to `paletteStore.ts` so sliders can read lock state
- **Hue/sat slider locking** — auto-lock on target set; Lock/LockOpen toggle on each slider (reusing LightnessRange pattern); unlocking allows drift without clearing target
- **Persistent target indicator** — swatch trigger shows chromatic ring when target is active, dimmed/dotted when drifted, clear (X) button on hover
- **Arrow notation in popover** — replace "Input"/"H+S at L50" with `#FF5733 → #BF4040` and annotation "hue + saturation at L50"
- **Inline multi-format display** — new `TargetFormats` component in ControlBar showing hex/rgb/hsl/oklch with click-to-copy when target is active
- **SliderBase disabled state** — add `disabled` and `accessory` props for lock icon and pointer-events-none

## Tasks

- TASK-0053
- TASK-0054
- TASK-0055
- TASK-0056
- TASK-0057
- TASK-0058

## Related

- TASK-0046 (done) — initial target color input implementation
- NOTE-0013 (archived) — original target color input idea
- EPIC-0012 — UX discoverability improvements (related but separate)
