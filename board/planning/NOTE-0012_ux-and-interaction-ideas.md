---
type: note
status: inbox
created: 2026-03-26
---

# UX & Interaction Ideas

Brainstorm items from the design polish session (2026-03-26).

## Discoverability & Labeling

### Add tooltips throughout
Controls like "endpoint/target", "lock", "adjustment" are not self-explanatory. Tooltips on hover would reduce the learning curve without cluttering the UI.

### Rename saturation mode labels
"endpoint" and "target" are confusing — "target" especially reads as a generic word, not a curve parameter. Consider clearer alternatives:
- **edges / center** — describes where the slider affects the curve
- **ends / vertex** — more mathematical but precise
- **range / peak** — describes the saturation behavior

### Move "Click swatch to copy" hint closer to swatches
Currently in the header, far from the actual swatches. Move it above the swatch grid where it's contextually relevant.

## Visual Refinement

### Evaluate new fonts
Geist Sans/Mono work well but feel developer-tool generic. Explore fonts that give a more refined, design-tool feel — possibly a humanist sans for body with Geist Mono retained for data.

### Explore reducing border radius
Current `rounded-xl` (12px) on panels and grid feels soft. A tighter radius (4-6px) would reinforce the "instrument, not toy" design principle.

## Layout Exploration

### Move curve chart to a collapsible left sidebar
Instead of the current right-column layout, the chart could live in a collapsible sidebar on the left. This would let the palette strip and swatch grid align vertically as one column — the primary content path. The chart becomes a reference panel you can reveal when needed.

## Curve Interactivity

### Make saturation curve charts interactive with drag handles
Add draggable handles to the curve visualization so users can adjust the curve shape directly by manipulating control points. This would make the relationship between the sliders and the curve more intuitive. *(Related: NOTE-0005 — adjustable curve vertex)*

### Add parameter to move curve edges inward
Currently the curve always spans 0-100 lightness. A new parameter (or extension of "range") could shift the curve's edge points inward, effectively narrowing the lightness range where saturation correction is applied.

## Palette Strip

### Add unadjusted strip option showing pure hue at 0-100% L
The "Compare" section shows unadjusted vs adjusted, but the unadjusted strip still uses the current saturation. Offer an option to show the hue at full 0-100% lightness with no saturation applied — a true baseline comparison.
