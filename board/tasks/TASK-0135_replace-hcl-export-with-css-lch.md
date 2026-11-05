---
type: task
status: backlog
priority: 1
created: 2026-11-04
parent: EPIC-0022
blocked_by:
  - TASK-0020
tags:
  - color-accuracy
---

# TASK-0135: Replace the hcl() export with CSS lch()

The export dialog's HCL color space writes values like `hcl(285, 50.8, 45.9)`. CSS has no `hcl()` function, so browsers drop every CSS, Tailwind and SCSS declaration that uses it. The numbers are not CSS LCh either: chroma's `hcl()` uses a D65 white point, and CSS `lch()` uses D50. For `#406abf`, chroma gives hue 285.2 and CSS `lch()` gives 277.8. Across sampled palettes, L differs by up to 1.6 and C by up to 5.0.

## Change

- Rename the `ColorSpace` value `hcl` to `lch` in `types/palette.ts:30`, `FormatSelector.tsx:25` (label "LCH") and `export.ts:15–21`. The selected space is local `ExportDialog` state, so nothing persisted needs migrating.
- Convert with culori's `lch` mode. It is CSS's D50 LCh and matches the reference exactly. Grays come back with chroma 0 and no hue.
- Format as `lch(L% C H)` with 2 decimals on each value. That reproduces every hex in a 153,328-color sample. With 1 decimal on hue, 4,126 (2.7%) miss.

## Why not chroma.js

chroma.js reaches D50 LCh only through `chroma.setLabWhitePoint("D50")`. That setting is global and also changes its OKLCH output: `#406abf` drops from C 0.141 to 0.103. Even with D50 set, chroma's LCh is off from the reference by up to 0.012 in C.

## Acceptance

- Exported `lch()` strings are valid CSS and parse back to each swatch's hex.
- `#406abf` exports as `lch(45.13% 50.44 277.82)`.
- No `hcl` remains in `app/src`.

## Source

- Color-accuracy review of EPIC-0009, 2026-11-04. Measured against colorjs.io 0.7.1, the CSS Color 4 reference implementation.
