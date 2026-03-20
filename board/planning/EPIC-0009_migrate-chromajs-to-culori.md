---
type: epic
status: planning
created: 2026-03-20
tags:
  - oklch-migration
  - dependencies
---

# EPIC-0009: Migrate from chroma.js to culori

Replace chroma.js with [culori](https://github.com/Evercoder/culori) as the sole color library. After EPIC-0006 lands, chroma.js remains used in four areas: contrast checking (`colors.ts`), export format conversion (`export.ts`), About dialog (`About.tsx`), and the SaturationCurve comparison strip. Culori has first-class OKLCH support, better gamut mapping, and a smaller bundle (tree-shakeable).

## Scope

- Replace `chroma.contrast()` in `colors.ts` with culori's contrast utilities
- Replace `chroma(hex).css('hsl')` / `.oklch()` / etc. in `export.ts` with culori format conversions
- Replace `chroma.hsl()` calls in `About.tsx` (educational strips, ColorPickerPlane) with culori
- Replace `chroma.hsl()` in SaturationCurve comparison strip with culori
- Evaluate whether the custom OKLCH functions from TASK-0020 can be replaced by culori equivalents (or kept for zero-dependency core)
- Remove chroma.js dependency from `package.json`

## Blocked by

- EPIC-0006 (core OKLCH migration must land first — chroma.js is still load-bearing until then)
- EPIC-0008 (About dialog rewrite — avoid migrating chroma.js calls that will be rewritten anyway)

## Reference

- culori repo: https://github.com/Evercoder/culori
- Q7 answer in NOTE-0006 analysis: "A wholesale switch to culori is a future cleanup task, not a migration blocker"
