---
type: epic
status: planning
created: 2026-03-26
---

# EPIC-0012: UX discoverability improvements

Improve the learnability of controls and reduce confusion for new users through tooltips, clearer labels, better placement of instructional hints, and clearer feedback about which value will be acted on.

## Scope

- **Add tooltips to controls** — hue, saturation, adjustment, range sliders and their mode toggles (endpoint/target, lock) all need hover tooltips explaining what they do.
- **Rename saturation mode labels** — "endpoint" and "target" are unclear. Evaluate alternatives: edges/center, ends/vertex, range/peak.
- **Relocate copy-format selector and hint** — covered by TASK-0081; the "click swatch to copy" affordance moves down to live alongside the swatches it acts on.
- **Highlight the active copy format** — covered by TASK-0082; once the selector is co-located, swatches must make it visually obvious which value will be copied.
- **Unadjusted reference strip** — covered by TASK-0083; show the curve's effect by rendering the unadjusted palette next to the adjusted one.

## Tasks

- TASK-0081 — Move clipboard format selector to swatch viewer
- TASK-0082 — Highlight active copy format on swatches
- TASK-0083 — Add unadjusted reference color strip
- TASK-0118 — Rename layout options to clarify grid behavior

## Source NOTEs

- NOTE-0012 — UX & Interaction Ideas (source brainstorm; font/radius items live in EPIC-0020).
- NOTE-0020 — Clarify grid layout option naming (extracted as TASK-0118).
- NOTE-0023 — Helper tooltips on hover (covered by the tooltips scope item).

## Related

- EPIC-0017 — Control defaults and affordances (sibling — focus on defaults and reset, vs. this EPIC's focus on learnability and feedback).
