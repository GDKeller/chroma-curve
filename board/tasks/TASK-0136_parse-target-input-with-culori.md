---
type: task
status: backlog
priority: 2
created: 2026-11-04
parent: EPIC-0022
blocked_by:
  - TASK-0020
tags:
  - color-accuracy
---

# TASK-0136: Parse target input with culori and gamut-map it

`parseTargetColor()` (`app/src/lib/colors.ts:25`) parses through chroma.js, which falls short of CSS Color 4 in three ways:

- **Rejected syntax:** `turn`, `rad` and `grad` hue units (`hsl(0.5turn …)`), comma-syntax `hsla()` with `deg`, `hwb()`, and `color(srgb …)` / `color(display-p3 …)` all fail to parse.
- **Rounding:** chroma.js rounds `hsl()` input to 8-bit RGB, which is why the `HSL_TOKENS` regex workaround exists. culori keeps typed values as given.
- **Clipping:** out-of-sRGB input is clipped per channel, which moves hue. `lch(50% 130 250)` clips to OKLCH hue 250.7, 56° from the input's 194.2. CSS Color 4 gamut mapping keeps it at 194.6.

Format detection is ours: `lch()`, `lab()` and `oklab()` input is detected as format "named", so the target row echoes it back as hex.

## Acceptance

- `parseTargetColor()` parses with culori's `parse`, and the `HSL_TOKENS` workaround is gone.
- Out-of-sRGB input goes through `toGamut("rgb", "oklch")` before hue and saturation are read.
- The format comes from culori's parsed mode. Decide which formats the target row echoes back; the rest fall back to hex explicitly.
- Existing `colors.test.ts` cases still pass (their vectors are in sRGB). New cases cover the syntax above, P3 input and `lch(50% 130 250)`.

## Source

- Color-accuracy review of EPIC-0009, 2026-11-04. Measured against colorjs.io 0.7.1, the CSS Color 4 reference implementation.
