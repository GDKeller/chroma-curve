---
type: task
created: 2026-03-16
status: done
epic: EPIC-0004
priority: 1
refs: [CQ-1, CQ-2]
---

# Document getSaturation guard and fix About.tsx constant ordering

Two related issues around code clarity and safety:

1. `getSaturation` in `lib/palette.ts:9` has a division-by-zero guard (`if (sMod === 0) return 1`) that is load-bearing — removing it causes `Infinity`. The guard needs a comment explaining why it exists and what `sMod=0` means semantically.

2. `About.tsx` declares `buildStrips` (line 39) before `BOUNDARY_SCALE` (line 71) which it references. This works at runtime since `buildStrips` is only called during render, but the ordering is fragile and confusing.

## Requirements

- Add a comment above the `sMod === 0` guard explaining: "sMod=0 means no curve adjustment — return baseline multiplier. Also prevents division by zero."
- Reorder `About.tsx` module-level constants so dependencies flow top-to-bottom: `LIGHTNESS_LABELS` → `BOUNDARY_SCALE` → `buildStrips`

## Files to modify

- `app/src/lib/palette.ts`
- `app/src/components/About.tsx`
