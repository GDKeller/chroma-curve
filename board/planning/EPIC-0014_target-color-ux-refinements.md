---
type: epic
status: planning
created: 2026-04-06
---

# EPIC-0014: Target color input UX refinements

Users enter a color (e.g., `#FF5733`) into the target picker, but the app extracts only hue + saturation and forces lightness to 50%. The swatch then shows a different hex value, which is confusing — users reasonably wonder "I put in this hex value, why am I seeing a different one?" The "H+S at L50" explanation is small and buried inside a popover with no persistent indicator, and the same confusion extends to HSL and OKLCH displays.

## Goals

- Make the L50 normalization obvious with clear before/after display of the user's input alongside the resulting working color
- Show a persistent "target active" indicator outside the popover so users can see at a glance that they entered a target
- Display the working color in all four formats (hex, rgb, hsl, oklch) inline so users can verify the identity and copy any representation
- Support a "drift" model: when users move hue/sat sliders after entering a target, the indicator goes stale rather than silently vanishing

## Scope

- **Move target state to Zustand** — target fields (`targetInput`, `targetFormat`, `targetHue`, `targetSat`) move from local TargetSwatch state to `paletteStore.ts` so `ControlBar` can render the inline multi-format display without prop drilling
- **Arrow notation in popover** — replace "Input"/"H+S at L50" with `#FF5733 → #BF4040` and annotation "hue + saturation at L50"
- **Persistent target indicator** — swatch trigger shows chromatic ring when target is active, dimmed/dotted when drifted, clear (X) button on hover
- **Inline multi-format display** — new `TargetFormats` component in ControlBar showing hex/rgb/hsl/oklch with click-to-copy when target is active
- **`formatAllFormats()` utility** — compose existing formatters to return `{ hex, rgb, hsl, oklch }` for a given hue/sat at L50

## Deferred

Slider-locking (TASK-0055, TASK-0056) was originally in scope to prevent accidental target invalidation, but it pre-emptively solves a problem users don't actually report and risks making the controls feel constrained. Dropping it in favor of the clarity-focused work above. Revisit only if real usage shows users losing targets by accident.

## Tasks

- TASK-0053
- TASK-0054
- TASK-0057
- TASK-0058
- TASK-0055 *(deferred)*
- TASK-0056 *(deferred)*

## Related

- TASK-0046 (done) — initial target color input implementation
- NOTE-0013 (archived) — original target color input idea
- EPIC-0012 — UX discoverability improvements (related but separate)
