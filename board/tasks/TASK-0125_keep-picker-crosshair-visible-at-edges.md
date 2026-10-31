---
type: task
status: backlog
priority: 3
created: 2026-10-30
parent: EPIC-0014
---

# TASK-0125: Keep the picker crosshair visible at the canvas edges and on light hues

The hue × saturation crosshair in `TargetSwatch/TargetSwatch.tsx` (`drawPicker`) has two legibility problems. Both predate this task.

- **Clipped at the edges.** At saturation 100%, which covers any pure brand color, only half the circle is drawn. At hue 0, only a quarter is drawn.
- **Low contrast on light hues.** Over yellow, cyan and green, neither ring reaches 3:1 against the gradient (WCAG 1.4.11). On yellow, the white ring is 1.03:1 and the dark halo is 2.83:1.

## Fix options

- Inset the gradient by about 6px, or clamp the crosshair center so the full circle stays inside the canvas.
- Make the outer halo thicker, or raise `--color-stroke-halo` alpha to about 0.6. Check what that does to the drifted swatch's inset edge, which uses the same token.
- Optional, from TASK-0122: the gradient never depends on hue or saturation. Build the `ImageData` once and redraw only the crosshair.

## Acceptance

- The crosshair is fully visible at every hue/saturation, including 0°, 360°, 0% and 100%.
- At least one of the two rings reaches 3:1 against the gradient underneath it.

## Related

- TASK-0112: Pointer Events and touch support for the same canvas.

## Source

- Review of commit 3e17daa (2026-10-30): visual UX and a11y reviewers.
