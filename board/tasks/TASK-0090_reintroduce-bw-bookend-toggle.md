---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0018
blocked_by:
  - TASK-0087
  - TASK-0088
---

# TASK-0090: Reintroduce B/W bookend swatch toggle

Reintroduce the "show black and white" toggle that prepends pure white (L=100) and appends pure black (L=0) to the palette as bookends, distinct from the lightness-range slider's chromatic endpoints.

## Acceptance

- Toggle in the swatch viewer (placement decided per TASK-0087's UI question).
- When enabled, palette gains true `#FFF` / `#000` framing swatches outside the chromatic scale.
- Count semantics per TASK-0087 (whether bookends extend or replace existing endpoints).
- Composes correctly with Tailwind preset per TASK-0087's stacking rule.
- Bookends export as `white` / `black` labels via the label field (TASK-0088).

## Placement

- Add it as a `ToggleSwitch` in `PaletteGrid`'s "Palette display options" bar above the swatches, next to the existing `labels` / `borders` / `reverse` toggles. Suggested label: `b/w`.

## Interaction with the current range default

- `lMin`/`lMax` currently default to `0`/`100` (`paletteStore.ts`), so the scale's outer swatches already come out as pure `#000` / `#FFF`. Until TASK-0079 lands, a "show B/W" toggle would duplicate those endpoints.
- Decide whether the toggle means "add bookends" (needs TASK-0079's tinted endpoints to make sense) or "hide pure B/W" (filter out L0/L100 when the range includes them). The user request (2026-11-04) was phrased as show/hide.
- Decide whether bookends also appear in `PaletteStrip`, the Compare strips, and the chart dots, or only in the swatch grid and export.

## Source

- NOTE-0032
- User request 2026-11-04: show/hide toggle for pure black & white swatches in the options above the swatches.
- TASK-0079 (range endpoint rework) interacts with this work.
