---
type: epic
status: planning
created: 2026-03-26
---

# EPIC-0010: Interactive curve editing

Make the saturation curve directly manipulable through visual interaction, replacing slider-only control with drag handles on the curve itself.

## Scope

- **Drag handles on curve** — add control points to the curve visualization that users can drag to reshape the parabola. Makes the relationship between parameters and curve shape immediately intuitive.
- **Edge parameter** — new control (or extension of the Range slider) to move the curve's edge points inward, narrowing the lightness range where saturation correction is applied. Currently the curve always spans 0-100% lightness.
- **Visual feedback** — show parameter values updating in real-time as handles are dragged, with the palette grid responding live.

## Related

- NOTE-0005: Adjustable curve vertex (center point) — related but focused on the vertex; this EPIC covers edge handles and the broader interaction model
- NOTE-0012: UX & Interaction Ideas — source brainstorm
