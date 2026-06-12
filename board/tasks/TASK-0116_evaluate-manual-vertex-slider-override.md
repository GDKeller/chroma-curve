---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0010
---

# TASK-0116: Evaluate manual vertex-position slider override

The hue-aware automatic vertex shift (TASK-0022 in EPIC-0006) handles most cases. NOTE-0005 originally proposed a user-controllable vertex slider — open question whether that's still valuable on top of the automatic version, or whether manual override is unnecessary noise.

## Decisions

- Is the automatic hue-aware vertex sufficient for the use cases NOTE-0005 was solving?
- If a manual override is added, does it take precedence over the auto value, or modulate it?
- Where does the slider live in the UI — alongside the curve editing controls of EPIC-0010, or in an "advanced" disclosure?
- Implementation: piecewise parabola vs. shifted-origin formula.

## Acceptance

- Decision documented in this task body or follow-up NOTE.
- If go-ahead, follow-up implementation tasks created under EPIC-0010.

## Source

- NOTE-0005
