---
type: epic
created: 2026-03-16
status: done
---

# Performance Optimization

The About modal generates 3200+ SVG elements (two 40×40 grids) without memoization, recomputing on every hue drag event. The export dialog runs `formatPalette` on every store update even when closed. Several minor unnecessary re-computations exist.

## Scope

- Memoize `ColorPickerPlane` SVG cell generation (CQ-8)
- Memoize `useCurvePickerVisuals` picker cell generation (CQ-9)
- Defer `formatPalette` computation until export dialog is open (CQ-7)
- Memoize `PaletteStrip` reverse operation (CQ-11)

## Tasks

- TASK-0009
- TASK-0010
- TASK-0011
