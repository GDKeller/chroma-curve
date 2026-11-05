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

# TASK-0134: Make oklch() strings reproduce their hex

`toOklchString()` (`app/src/lib/colors.ts:83`) rounds L and C to 3 decimals and hue to a whole degree. That is too coarse to pin down an 8-bit color. Parsed back with the CSS Color 4 reference, the string lands on a different hex for 11% of swatches (1,594 of 14,544) and 55% of target rows (797 of 1,440). Each miss is one step in one channel, so nobody sees it, but the copied `oklch()` and hex no longer describe the same color.

`export.ts:22–28` repeats the same formatting. Swatch labels, swatch copy, the target row and every export should share one formatter.

Precision measured over 154,690 colors (palettes, target rows and a 52³ RGB grid), converting with culori:

| L/C decimals | Hue decimals | Strings that miss their hex |
|---|---|---|
| 3 | 0 (current) | 76,098 (49.2%) |
| 4 | 1 | 4,771 (3.1%) |
| 4 | 2 | 139 (0.09%) |
| 5 | 1 | 4,328 (2.8%) |
| 5 | 2 | 0 |

## Why culori (blocked by TASK-0020)

chroma.js's OKLCH is off from the reference by up to 3.9e-5, which shows in the 5th decimal. It also gives pure grays a nonzero chroma (`#808080` → C 0.0000233), so at 5 decimals 248 of 256 grays would print a spurious chroma. culori matches the reference and returns chroma 0 for grays.

## Acceptance

- One `oklch()` formatter, used by `ColorSwatch` (label and copy value), `formatTargetColor()` and `export.ts`.
- Precision decided: 5 decimals on L/C and 2 on hue reproduce every hex; 4 and 2 give shorter strings and miss 0.09%.
- Unit test: each swatch's `oklch()` string parses back to its own hex.
- Grays print chroma 0 and hue 0.

## Related

- TASK-0029, TASK-0030: switch the source to native OKLCH floats after the migration, and keep this formatter.

## Source

- Color-accuracy review of EPIC-0009, 2026-11-04. Measured against colorjs.io 0.7.1, the CSS Color 4 reference implementation.
