---
type: note
status: inbox
created: 2026-03-26
---

# UI Design Polish Backlog

Remaining polish items identified during the design-polish pass (2026-03-26).

## Items

### 1. Palette strip context
The thin gradient bar (`PaletteStrip`) below the controls floats with no label or explanation. It shows the full generated palette at all lightness steps but a new user wouldn't know that. Options: add a subtle label like "FULL PALETTE" in the same uppercase style as chart headers, or integrate it more tightly with the grid (e.g. as a preview row above the grid toolbar).

### 2. Empty space below grid
In row layout with 8 swatches, the left column ends at the bottom of the swatch grid while the right column (charts) extends much further. This leaves a large dead zone. Could be addressed by: letting the grid fill more vertical space in row mode, adding content below the grid (e.g. palette metadata or usage tips), or adjusting the layout breakpoint so charts sit below the grid instead of beside it at certain widths.

### 3. "Compare" disclosure styling
The `▸ Compare` toggle in the Saturation Adjustment chart uses `text-text-faint` — nearly invisible at 32% lightness on a dark surface. Should be bumped to at least `text-text-subtle` (44%) with a hover state, and possibly given a small icon (e.g. Phosphor `CaretRight`) to make it feel more interactive.

### 4. Export button prominence
Currently `bg-surface-active text-text-primary` — looks like a secondary action. As the only CTA in the header, it could use slightly more contrast or a subtle border to differentiate from the background. Keep it restrained (this isn't a SaaS dashboard) but make it clearly the primary action.

### 5. Missing favicon
Console shows `GET /favicon.ico 404` on every load. Needs a simple favicon — could be a minimal curve glyph or abstract mark that works at 16x16 and 32x32. SVG favicon preferred for sharpness at small sizes.
