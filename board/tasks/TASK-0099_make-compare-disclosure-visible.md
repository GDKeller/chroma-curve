---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0020
---

# TASK-0099: Make Compare disclosure visible

The "Compare" disclosure currently uses `text-text-faint` with no caret or hover state, so it reads as ambient text rather than an interactive affordance. Users miss it entirely.

## Acceptance

- Compare disclosure uses a stronger text token (`text-text-muted` or `text-text-secondary`).
- Hover/focus state visibly distinguishes it from static text.
- Caret or chevron icon clarifies expandable behavior.
- Optionally: default to expanded so the comparison is always visible (decide during implementation).

## Source

- NOTE-0010 (#3), NOTE-0011

## Related

- TASK-0083 — unadjusted reference strip; pairs with this disclosure's contents.
