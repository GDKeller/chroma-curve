---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0018
blocked_by:
  - TASK-0087
---

# TASK-0088: Add `label` field to ColorEntry and propagate

Implement the label data model decided in TASK-0087: extend `ColorEntry` with a `label` field, thread it through palette generation, swatch rendering, and export.

## Acceptance

- `ColorEntry` carries an optional label per the decided shape.
- `generateNeutrals()` (or its OKLCH replacement) populates labels when the active preset/feature provides them.
- ColorSwatch renders the label when present, gracefully omits when absent.
- Export utilities consume labels for token names and CSS custom properties.

## Source

- NOTE-0007, NOTE-0031, NOTE-0032
