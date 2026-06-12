---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0017
---

# TASK-0109: Add randomize-parameters button to control bar

Add a small "randomize" affordance that picks new hue, saturation, and adjustment values within sensible bounds for exploration.

## Decisions

- Whether to randomize lightness range too (default: no — keep range as user-set).
- Bounds for randomized values (avoid degenerate output: zero saturation, extreme adjustment).
- Repeated presses produce different outputs (no fixed seed).

## Acceptance

- Single button (icon, restrained) in the control bar.
- Click randomizes hue, saturation, and adjustment within the chosen bounds.
- Animation/transition is subtle — value-change feedback, not a celebratory effect.

## Source

- NOTE-0022
