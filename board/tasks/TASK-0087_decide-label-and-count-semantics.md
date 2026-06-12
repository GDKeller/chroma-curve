---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0018
---

# TASK-0087: Decide label and count semantics for named scales

Planning task that locks down cross-feature decisions blocking implementation of named scales (Tailwind preset, B/W bookends, custom intervals, named colors).

## Decisions

- **Label model**: optional `label` field on each `ColorEntry`. String only, or structured (kind, value)?
- **Count semantics when features compose**: count = 8 with B/W on → 8 or 10? Tailwind preset (11) + B/W → 13 or override? Custom intervals — labels follow positions?
- **Default labeling**: with no preset active, show numeric labels or stay unlabeled?
- **Export labels**: bookends export as `white`/`black`; Tailwind exports as `gray-50` etc.; custom intervals — by index or position?

## Acceptance

- Decision recorded in this task body or a follow-up NOTE.
- Label data model specified for `ColorEntry`.
- Count semantics specified for: bare, +B/W, +Tailwind, +B/W+Tailwind, +custom intervals.

## Source

- NOTE-0007, NOTE-0021, NOTE-0031, NOTE-0032
