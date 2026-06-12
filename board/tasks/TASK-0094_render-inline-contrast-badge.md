---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0019
blocked_by:
  - TASK-0092
  - TASK-0093
---

# TASK-0094: Render inline contrast badge for selected pair

Implement the contrast readout per the UX decided in TASK-0093, using the metrics utility from TASK-0092.

## Acceptance

- Readout shows the contrast ratio numerically and an AA/AAA pass/fail indicator for normal and large text.
- Visual treatment matches the dark, instrument-grade aesthetic — no traffic-light colors that compete with the palette.
- Empty state when no pair is selected, smooth transitions when the pair changes.

## Source

- NOTE-0002
