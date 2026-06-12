---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0014
---

# TASK-0112: Add Pointer Events / touch support to TargetSwatch canvas

The TargetSwatch canvas color picker is currently mouse-only. Convert to Pointer Events so touch and stylus work end-to-end.

## Acceptance

- Canvas picker responds to touch on mobile/tablet.
- Pointer capture handles drag-out behavior (start on canvas, drag off, release).
- Mouse behavior unchanged.
- Crosshair indicator remains in sync during touch drags.

## Source

- NOTE-0030
