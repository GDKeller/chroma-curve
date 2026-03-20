---
type: note
status: inbox
created: 2026-03-20
---

# In-context contrast checker for palette swatches

Might be useful to add a contrast checker utility across the palette swatches. Since the user can adjust min/max points of the curve, giving them the ability to see if — for example — the lightest shade as text on the darkest shade as background meets a11y contrast ratios.

This is **not** a dedicated contrast checker (plenty of those exist online). Instead it brings that action into the context of the user's experience with this tool, eliminating the need to copy values into an external checker.

## Possible interactions

- Select two swatches to compare (e.g. click lightest + darkest)
- Show WCAG AA / AAA pass/fail inline
- Could surface automatically for endpoint swatches or user-selected pairs
