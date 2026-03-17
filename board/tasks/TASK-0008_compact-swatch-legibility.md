---
type: task
created: 2026-03-16
status: done
epic: EPIC-0002
priority: medium
refs: [UX-7]
---

# Fix compact swatch label legibility

When `swatchCount > 24`, `ColorSwatch` renders in compact mode with labels at `text-[9px]` and hex values at `text-[7px]`. These are below any practical legibility threshold.

## Requirements

- Option A (preferred): Hide labels entirely in compact mode (`showLabels={false}`) and rely on hover tooltips
- Option B: Set a minimum font size floor of 10px for any visible text
- Ensure the swatch remains clickable to copy even without visible labels
- Consider showing label on hover via a tooltip when labels are hidden

## Files to modify

- `app/src/components/palette/ColorSwatch.tsx`
- `app/src/components/palette/PaletteGrid.tsx` (adjust `showLabels` logic)
