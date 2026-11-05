---
type: epic
status: planning
created: 2026-11-04
tasks:
  - TASK-0020
  - TASK-0133
  - TASK-0134
  - TASK-0135
  - TASK-0136
tags:
  - color-accuracy
---

# EPIC-0022: Make color values exact across the pipeline

Every value the app shows, copies or exports should describe the same color, follow the CSS Color 4 math, and be valid CSS. A review on 2026-11-04 measured the pipeline against colorjs.io 0.7.1, written by the CSS Color 4 editors, and found gaps at each stage:

- **Generation:** target mode clips saturation above 100%, which moves hue and lightness (TASK-0133).
- **Input:** target input rejects valid CSS Color 4 syntax and clips out-of-sRGB colors instead of gamut-mapping them (TASK-0136).
- **Output:** `oklch()` strings are too coarse to reproduce their hex (TASK-0134), and the HCL export isn't valid CSS (TASK-0135).

This epic holds the work that changes output. Library swaps that don't change output stay in EPIC-0009.

## Order

- TASK-0020 first: it adds culori. TASK-0134, TASK-0135 and TASK-0136 wait on it, as do EPIC-0006's TASK-0021, TASK-0022 and TASK-0024.
- TASK-0133 has no blockers.

## Why culori (2026-11-04)

Against the same reference:

- **Conversion:** culori's OKLCH matches the reference to 1e-16. chroma.js is off by up to 3.6e-5 in L, 3.9e-5 in C and 0.11° in hue, and gives pure grays a nonzero chroma.
- **Independent spaces:** chroma.js routes OKLab through its Lab white point, a global setting. Setting it to D50 for CSS `lch()` drops `#406abf` from C 0.141 to 0.103. culori keeps each space separate.
- **Parsing:** culori's `parse` accepts all CSS Color 4 syntax. chroma.js rejects `turn`, `rad` and `grad` hue units, `hwb()` and `color()`, and rounds `hsl()` input to 8-bit RGB.
- **Gamut mapping:** chroma.js only clips per channel. culori's `toGamut` implements the CSS Color 4 method (within 1.2/255 of the reference over 4,104 out-of-gamut colors), and `clampChroma` finds the sRGB chroma boundary that TASK-0021 caches.

A custom pipeline would mean writing and testing all of this ourselves, then deciding again in EPIC-0009 whether to keep it.

## Related

- TASK-0100 (EPIC-0020): swatch label contrast. 710 of 14,544 swatches miss WCAG AA, and the fix needs a decision on the `#1d1d1d` dark text color.
- EPIC-0006: builds OKLCH generation on culori.
- EPIC-0009: removes chroma.js once nothing depends on it.
