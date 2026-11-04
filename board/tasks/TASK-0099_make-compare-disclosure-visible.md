---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0020
---

# TASK-0099: Make Compare disclosure visible

The "Compare" disclosure currently uses `text-text-faint` with no caret or hover state, so it reads as ambient text rather than an interactive affordance. Users miss it entirely.

## Progress (2026-11-04)

Partly done already. The description above predates the current `ChartTabs` Compare button.

- **Done:** caret icon (Phosphor `Triangle`, rotates on open) and a hover state (`hover:text-text-muted`).
- **Remaining:** base color is still `text-text-faint`; no `focus-visible` style; still defaults to collapsed (`useState(false)`), decision pending.

## Acceptance

- Compare disclosure uses a stronger text token (`text-text-muted` or `text-text-secondary`).
- Hover/focus state visibly distinguishes it from static text.
- Caret or chevron icon clarifies expandable behavior.
- Optionally: default to expanded so the comparison is always visible (decide during implementation).

## Source

- NOTE-0010 (#3), NOTE-0011

## Related

- TASK-0083 — unadjusted reference strip; pairs with this disclosure's contents.
