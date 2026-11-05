---
type: task
status: backlog
priority: 1
created: 2026-11-04
parent: EPIC-0022
tags:
  - color-accuracy
---

# TASK-0133: Clamp target-mode saturation at 100%

In `target` satMode, `getSaturation()` divides by the L50 vertex, so the multiplier rises above 1 toward both ends. `generateNeutrals()` (`app/src/lib/palette.ts:53`) passes `saturation * sK` to `chroma.hsl()` without a cap. Above 100% saturation, HSL→RGB produces channels outside 0–255, and chroma clips each channel on its own. That shifts hue and lightness as well as saturation.

With the default adjustment (sMod 70), any saturation above 65.2% clips. For a requested hue of 220:

- **Saturation 100%:** 98 of 99 steps clip (all but L50). grey-10 renders as `hsl(226 100% 11.8%)` and grey-90 as `hsl(217 100% 88.2%)`.
- **Saturation 80%:** 32 steps clip, and hue moves by up to 4.1°.
- **Saturation 50% at the strongest adjustment (sMod 26):** 78 steps clip. grey-27 renders as pure blue, `hsl(240 100% 50%)`, and lightness is off by up to 39 points.

Endpoint mode is unaffected: its multiplier never exceeds 1. With the cap, high saturations flatten at 100% toward the ends, which is the real ceiling of HSL.

## Acceptance

- Effective saturation is `Math.min(1, saturation * sK)`, computed in one shared helper in `palette.ts`.
- `generateNeutrals()` and the Effective Saturation chart (`EffectiveSaturation.tsx:23,35`) both use the helper, so the chart shows what the swatches render.
- Unit test: in target mode with saturation above 0, every entry from L1 to L99 keeps the requested hue and its step's lightness, at any saturation and adjustment.

## Source

- Color-accuracy review of EPIC-0009, 2026-11-04
