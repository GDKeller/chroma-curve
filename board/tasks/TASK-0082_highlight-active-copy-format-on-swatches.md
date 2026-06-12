---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0012
---

# TASK-0082: Highlight active copy format on swatches

When the user changes the copy-format selector in the swatch viewer, the swatches should make it obvious which value will be copied on click. Today the selector changes but the swatch display doesn't visually emphasize the chosen format.

## Options to consider

- **Reorder**: show the selected format **first** in the swatch's stack of values.
- **Bold or weight**: render the active format in a heavier/brighter weight than the others.
- **Token contrast**: use a stronger text token (`text-primary`) for the active value, downshift the others to `text-muted`/`text-faint`.
- **Subtle outline or pill** around the active format.

A combination is likely the right answer — reorder so it's first, use the strongest text token, leave the rest as secondary references.

## Acceptance

- Glancing at any swatch makes it unambiguous which value will land in the clipboard.
- Switching the format selector visibly reorganizes/restyles the swatch values.
- Other format values remain visible (don't hide them — swatches still serve as a multi-format reference).

## Related

- TASK-0081 (move format selector into swatch viewer) — pairs with this; do that first.
- NOTE-0018 (improve swatch copy feedback).
