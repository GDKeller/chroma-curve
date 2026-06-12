---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0012
---

# TASK-0081: Move clipboard format selector to swatch viewer

Move the "clip swatch to copy" format selector down from its current location into the swatch viewer area, so the copy-format choice lives next to the swatches it affects.

## Why

The selector controls what gets written to the clipboard when a swatch is clicked, but it currently sits away from the swatches. Co-locating it puts the cause and effect in the same visual region, which:

- Makes the connection between selector and click target obvious without having to look elsewhere.
- Frees space in the upper controls for things that actually configure the palette.
- Sets up the discoverability improvements in TASK-0082 (highlighting which value will be copied).

## Acceptance

- Format selector is rendered in the swatch viewer region.
- Clicking a swatch still copies the selected format.
- Visual hierarchy in the swatch viewer is preserved; the selector doesn't overpower the swatches themselves.

## Related

- TASK-0082 — once the selector is co-located, the active format should be highlighted on the swatches.
- NOTE-0018 (improve swatch copy feedback) — adjacent UX work on copy affordance.
