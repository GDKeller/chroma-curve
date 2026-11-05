---
type: epic
status: planning
created: 2026-03-20
updated: 2026-11-04
tags:
  - oklch-migration
  - dependencies
---

# EPIC-0009: Migrate from chroma.js to culori

Make [culori](https://github.com/Evercoder/culori) the only color library and remove chroma.js. culori arrives with EPIC-0022 (TASK-0020), which also moves every chroma.js call whose output changes. This epic swaps the rest and removes the dependency. See EPIC-0022, "Why culori", for the measurements.

Swapping libraries doesn't change today's palettes: HSL→hex is identical for 266,375 of 266,640 inputs, and the other 265 are exact .5 channel ties.

## chroma.js call sites (2026-11-04)

- `lib/colors.ts`: label contrast (`getContrastColor`), target-color parsing and formatting (TASK-0134 and TASK-0136 move parsing and the `oklch()` formatter first)
- `lib/export.ts`: export conversions (TASK-0134 and TASK-0135 move `oklch()` and `lch()` first)
- `lib/palette.ts`: HSL generation, replaced by EPIC-0006 (TASK-0024)
- `components/TargetSwatch/TargetSwatch.tsx`: target preview canvas
- `components/ChartTabs/ChartTabs.tsx`: unadjusted Compare strip
- `components/AboutButton/AboutButton.tsx`: educational strips, rewritten by EPIC-0008

## Scope

- Replace `chroma.contrast()` with culori's `wcagContrast`. Results match: both are within 0.001 of the reference.
- Replace the remaining `chroma.hsl()` and `chroma(hex)` calls: hex and rgb in `formatTargetColor()`, the rgb and GPL exports, `TargetSwatch.tsx`, `ChartTabs.tsx` and, after EPIC-0008, `AboutButton.tsx`.
- Remove `chroma-js` and `@types/chroma-js` from `app/package.json`.

## Blocked by

- TASK-0020 (EPIC-0022) adds culori. The contrast swap can move as soon as it lands.
- EPIC-0022 before removing chroma.js: it moves parsing and the `oklch()` and `lch()` conversions.
- EPIC-0006 before removing chroma.js: `palette.ts` generates with it until TASK-0024.
- EPIC-0008 for `AboutButton.tsx`: avoid migrating calls the rewrite replaces.

## Reference

- culori repo: https://github.com/Evercoder/culori
- EPIC-0022, "Why culori": accuracy measurements against colorjs.io, the CSS Color 4 reference implementation (2026-11-04)
- Q7 answer in NOTE-0006 analysis *(superseded 2026-11-04)*: "A wholesale switch to culori is a future cleanup task, not a migration blocker"
