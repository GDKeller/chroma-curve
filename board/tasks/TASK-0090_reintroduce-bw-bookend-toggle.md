---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0018
blocked_by:
  - TASK-0087
  - TASK-0088
---

# TASK-0090: Reintroduce B/W bookend swatch toggle

Reintroduce the "show black and white" toggle that prepends pure white (L=100) and appends pure black (L=0) to the palette as bookends, distinct from the lightness-range slider's chromatic endpoints.

## Acceptance

- Toggle in the swatch viewer (placement decided per TASK-0087's UI question).
- When enabled, palette gains true `#FFF` / `#000` framing swatches outside the chromatic scale.
- Count semantics per TASK-0087 (whether bookends extend or replace existing endpoints).
- Composes correctly with Tailwind preset per TASK-0087's stacking rule.
- Bookends export as `white` / `black` labels via the label field (TASK-0088).

## Source

- NOTE-0032
- TASK-0079 (range endpoint rework) interacts with this work.
