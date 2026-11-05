---
type: task
status: backlog
priority: 1
created: 2026-05-06
updated: 2026-11-04
parent: EPIC-0020
tags:
  - color-accuracy
---

# TASK-0100: Improve swatch-label legibility on mid-tone backgrounds

Swatch labels (hex/HSL/OKLCH values) auto-switch between dark and light text based on background lightness, but the L30–70 mid-tone range produces marginal contrast in either direction. The HSL-value type size also drops below comfortable reading at small swatch sizes.

## Acceptance

- Mid-tone backgrounds (L30–70) reach WCAG AA contrast for label text — via text-shadow, a subtle backing pill, or a guaranteed-legible token rather than auto-switch.
- Minimum HSL-value font size raised to a comfortable floor.
- Existing dark/light auto-switch preserved for clear-cut cases.

## Findings (2026-11-04)

Measured on 14,544 swatches (every 10° of hue, saturation 5/20/50/100%, every lightness step, endpoint mode, default adjustment):

- `getContrastColor()` (`app/src/lib/colors.ts:5`) uses white when white reaches 4.5:1 and `#1d1d1d` otherwise. 710 swatches (4.9%) get label text below 4.5:1, and in 359 of them white was the higher-contrast choice.
- Picking the higher-contrast of `#1d1d1d` and white leaves the same 710 below 4.5:1. With `#1d1d1d` as the dark color, the worst mid-tone reaches only 4.11:1.
- Picking the higher-contrast of `#000` and white passes AA on every background: the worst case is √21 ≈ 4.58:1. Any dark color up to `#060606` keeps that guarantee.

So the auto-switch alone can meet the first acceptance item, with no text-shadow or pill, if it picks the higher-contrast color and uses `#060606` or darker for dark text. The value lines are 10px (`text-2xs`), so 4.5:1 applies, not the 3:1 large-text threshold.

## Source

- NOTE-0011
