---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0017
---

# TASK-0086: Add "reset to default" for saturation, adjustment, and range

Add a "reset to default" affordance for the core curve-shaping controls — saturation, adjustment, and lightness range — that returns each (or all) to the **perception-corrected default**: the curve as described in the original Desmos formula and reference paper.

## Why

The defaults are not arbitrary — they're the published, perception-corrected curve that the whole tool is built on. Once a user starts dragging, they can lose the reference point. A reset affordance:

- Lets users explore freely knowing they can always get back to the canonical curve.
- Reinforces that the default *is* the canonical perception-corrected setting, not just an opening position. This is a small but important piece of the "show the math" pedagogy.
- Reduces friction for the "I broke it, let me start over" moment.

## Design questions

- **Granularity**: per-control reset (small button next to each), or a single global "reset" that snaps everything back? Probably both — per-control is the precise tool, global is the "start over" escape hatch.
- **Affordance**: small icon button (e.g., `arrow-counter-clockwise` from Phosphor) next to each control's value display? Inline link inside a tooltip?
- **Visibility of default state**: When a control *is* at default, show the reset button dimmed/hidden? Or always visible? Showing it only when modified makes the affordance meaningful — its presence signals "you've moved from default."
- **Communicating "default = perception-corrected"**: A tooltip on the reset button ("Reset to perception-corrected default") makes the curve's canonical status explicit. Or a hover label that names the formula reference.
- **Confirmation**: Reset is destructive of in-progress tweaks. Probably no confirmation needed for per-control reset (cheap to redo); maybe a subtle undo affordance for global reset.

## Acceptance

- User can return any of saturation, adjustment, or lightness range to its perception-corrected default with a single action.
- The affordance communicates that the default *is* the canonical curve, not just a starting position.
- Reset is only visible/active when the control has been modified from default.

## Related

- EPIC-0017 (parent) — Control defaults and affordances.
- EPIC-0012 — UX discoverability (sibling; tooltips on the reset button overlap with that EPIC's tooltip work).
- The original Desmos reference: [desmos.com/calculator/02ufrfsuzy](https://www.desmos.com/calculator/02ufrfsuzy)
- [REFE-0001](board/reference/REFE-0001_parabolic-saturation-curve-for-neutral-palettes.md) — parabolic curve documentation.
