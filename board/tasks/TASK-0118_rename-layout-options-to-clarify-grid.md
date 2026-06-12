---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0012
---

# TASK-0118: Rename layout options to clarify grid behavior

The "vertical" / "horizontal" layout options describe the orientation of the grid axis but read to users as "stripes" rather than "grids." Rename to make the grid behavior obvious.

## Candidates

- "Rows" / "Columns" — clearest plain English.
- "Wide grid" / "Tall grid" — communicates dominant axis.
- "Landscape" / "Portrait" — borrows familiar terminology.

## Acceptance

- New labels picked, applied to the layout selector and any tooltips.
- Store key (`layout: 'horizontal' | 'vertical'`) renamed if internal name still feels misleading; otherwise leave as-is and only update copy.

## Source

- NOTE-0020
