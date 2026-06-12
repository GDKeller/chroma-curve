---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0017
---

# TASK-0108: Add typed input and stepper buttons for slider values

Augment the hue/saturation/adjustment/range sliders with direct numeric input and increment/decrement buttons for fine-grained control. Sliders stay primary; typed input and steppers are the precision affordance.

## Acceptance

- Each slider exposes a numeric input that round-trips with the slider value.
- ±1 stepper buttons (or keyboard arrows) for fine adjustments.
- Validation clamps to the slider's min/max.
- Range slider supports independent typed input for each thumb when unlocked.

## Source

- NOTE-0015
