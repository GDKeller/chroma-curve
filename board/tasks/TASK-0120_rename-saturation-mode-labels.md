---
type: task
status: backlog
priority: 2
created: 2026-10-20
parent: EPIC-0012
---

# TASK-0120: Rename saturation mode labels

The saturation slider's mode toggle shows the raw `satMode` value, `endpoint` or `target`, as its visible label. Neither reads as a curve parameter. Since the target color input (TASK-0046) shipped, "target" also means two different things in the same control bar: the L50 saturation mode, and the user-entered target color.

## Candidate labels (from NOTE-0012)

- **edges / center** — describes where the slider acts on the curve
- **ends / vertex** — more mathematical, but precise
- **range / peak** — describes the saturation behavior

## Scope

- Choose the new pair and update the visible label in `SaturationSlider/SaturationSlider.tsx`. It currently renders `{satMode}` directly, so the display string needs to decouple from the enum value.
- Decide whether to also rename the internal `"endpoint" | "target"` union (used by `paletteStore` and `getSaturation()` in `lib/palette.ts`) or keep it as an internal identifier with a display-label map.
- Update any About dialog, chart, or export copy that refers to the modes by name.

## Acceptance

- The visible mode labels no longer use "target", and nothing collides with the target color feature.
- The toggle's accessible name and tooltip/title copy match the new labels.
- No behavior change to the curve math.

## Related

- TASK-0119 — Add hover tooltips to control labels (tooltip copy should use the new labels).
- TASK-0084 — Disambiguate "fixed saturation" labels in About dialog (adjacent copy work).

## Source

- NOTE-0012 (Rename saturation mode labels)
