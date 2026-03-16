---
type: task
created: 2026-03-16
status: open
epic: EPIC-0003
priority: low
refs: [CQ-11]
---

# Memoize PaletteStrip reverse operation

`PaletteStrip` creates `[...entries].reverse()` on every render. Since `entries` comes from `usePalette()` which is already memoized, the reverse can also be memoized.

## Requirements

- Wrap in `useMemo(() => [...entries].reverse(), [entries])`

## Files to modify

- `app/src/components/palette/PaletteStrip.tsx`
