---
type: task
status: backlog
priority: 2
created: 2026-11-04
parent: EPIC-0020
---

# TASK-0132: Add swatch position indicators to PaletteStrip

The large full-scale `PaletteStrip` shows every lightness step but gives no hint which steps the swatch grid below is displaying. Add a small marker (e.g. a triangle) along the strip's bottom edge under each displayed swatch's position.

## Notes

- `swatchCount` and the sampling (`sampleEntries`) are local to `PaletteGrid`, so the strip can't see them. Lift `swatchCount` into `paletteStore` (or share the sampled set) so the strip and the grid stay in sync from one source.
- TASK-0117 (chart swatch-only density) needs the same sampled set, so build the lifted selection once and reuse it there.

## Acceptance

- One indicator per displayed swatch, aligned to that swatch's step in the strip.
- Indicators update when the swatch count or lightness range changes.
- Indicators use stroke/text tokens and stay visible over both light and dark ends (consider `stroke-halo`).
- Works alongside TASK-0095's context label without crowding.
