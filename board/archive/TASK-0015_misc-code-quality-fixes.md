---
type: task
created: 2026-03-16
status: done
epic: EPIC-0004
priority: 3
refs: [CQ-10, CQ-12, CQ-13, CQ-14, CQ-15]
---

# Fix miscellaneous code quality issues

Collection of minor code quality fixes from the review.

## Items

1. **CQ-10** `PaletteGrid.tsx:10,50` — Magic number `98` as default swatch count. Derive from `generateNeutrals` output length or export a constant from `palette.ts`.
2. **CQ-12** `lib/palette.ts:34-35` — Simplify `Math.round(Math.round((s + Number.EPSILON) * 100 * 100) / 100)` to `Math.round(s * 10000) / 100` or equivalent clear formula.
3. **CQ-13** `About.tsx:700,760` — Replace empty `<div />` grid spacers with `grid-column` CSS positioning on adjacent elements.
4. **CQ-14** `controls/SliderBase.tsx:10` — Add `import type React from 'react'` or use `import { type CSSProperties } from 'react'`.
5. **CQ-15** `About.tsx:87,88` — Use stable keys in `Strip` component (e.g., lightness value or color hex) instead of array index.
