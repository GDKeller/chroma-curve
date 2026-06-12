---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0019
blocked_by:
  - TASK-0092
---

# TASK-0093: Design swatch-pair selection UX for contrast comparison

The contrast checker needs an interaction model: how does a user pick two swatches to compare?

## Options

- **Click-to-pin**: one click pins as foreground, second click pins as background; click outside to clear.
- **Hover-pair**: pinned swatch sets foreground; hovering any other swatch shows live ratio against it.
- **Dedicated picker**: explicit foreground/background selectors next to the readout.

A combination is likely — pinned-FG + hover-BG matches palette exploration patterns and feels light-touch.

## Acceptance

- Interaction model decided and documented.
- Mockup or low-fi flow showing pin/clear behavior, readout placement, and edge cases (single swatch, deselected state).

## Source

- NOTE-0002
