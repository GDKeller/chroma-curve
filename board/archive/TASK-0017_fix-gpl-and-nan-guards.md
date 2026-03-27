---
type: task
created: 2026-03-16
status: done
epic: EPIC-0005
priority: medium
refs: [EX-1, EX-2]
---

# Fix GPL float RGB and color space NaN guards

Two correctness issues in `lib/export.ts`:

1. **EX-2** GPL format uses `c.rgb()` which returns floats. `String(127.0000001).padStart(3)` produces misaligned columns. Needs `Math.round()` on each channel.
2. **EX-1** HCL color value guards hue for NaN (`h || 0`) but not chroma (`c2`). While chroma is typically 0 for achromatic (not NaN), the guard pattern should be consistent. Apply `|| 0` to all channels that could be NaN.

## Requirements

- `formatGPL`: Change to `Math.round(r)`, `Math.round(g)`, `Math.round(b)` before `String().padStart(3)`
- `colorValue` HCL case: Add `|| 0` guard to `c2` for consistency
- `colorValue` OKLCH case: Verify `c2` (chroma) is also guarded

## Files to modify

- `app/src/lib/export.ts`
