---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0017
---

# TASK-0107: Add responsive mobile dock for control bar

On narrow viewports, dock the control bar to the bottom of the screen for thumb reach. Desktop sticky-top behavior unchanged.

## Acceptance

- Below a sensible breakpoint (e.g., ≤640px), control bar fixes to the bottom edge.
- Touch targets meet 44px minimum.
- Sticky-bottom respects safe-area insets on iOS.
- Desktop layout untouched.

## Source

- NOTE-0014
