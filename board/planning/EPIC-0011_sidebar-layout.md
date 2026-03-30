---
type: epic
status: planning
created: 2026-03-26
---

# EPIC-0011: Collapsible sidebar layout for curve charts

Explore moving the saturation curve chart panel from the right column into a collapsible left sidebar, so the palette strip and swatch grid form a single aligned vertical column as the primary content.

## Scope

- **Sidebar panel** — chart tabs (adjustment/computed), compare strips, and steps toggle move into a left-side panel
- **Collapse/expand** — sidebar should be collapsible to maximize palette viewing space, with a toggle to reveal it
- **Responsive behavior** — on smaller screens the sidebar likely becomes a bottom sheet or overlay rather than a persistent column
- **Layout alignment** — with charts in a sidebar, the palette strip and swatch grid stack cleanly as one column

## Considerations

- This is an exploratory layout change — may not be the right direction. Prototype before committing.
- The current right-column layout works well at desktop widths; the sidebar approach trades chart visibility for palette prominence.
