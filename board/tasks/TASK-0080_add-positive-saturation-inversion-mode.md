---
type: task
status: backlog
priority: 3
created: 2026-05-06
---

# TASK-0080: Add positive (inverted) saturation adjustment mode

Add the ability to flip the saturation adjustment from negative (current default — midtones desaturated) to positive (midtones boosted) as a creative-tool use case. The parabolic curve becomes its inverse: instead of pulling chroma down at midtones, it pushes it up.

## Why

The current curve is engineered to fix the perceptual problem of midtones looking too saturated relative to extremes. But the inverse — a palette that *peaks* in saturation at the midtones and falls off at the extremes — is a legitimate creative palette shape (vivid mids, muted shadows/highlights). Exposing the inversion turns Chroma Curve into a more general curve-shaping instrument rather than a one-way correction tool.

## Design questions

- **UI affordance**: A polarity toggle on the saturation control? A signed input that accepts negative or positive percentages directly? A separate "mode" pill? Whatever it is, it should make clear which direction the curve currently bends.
- **Curve visualization**: The chart needs to flip with the polarity so the user can see the inversion, not just feel it in the swatches.
- **Naming**: "Adjustment" is currently neutral. If we expose polarity, the labels probably need to communicate direction — "smooth" vs "boost," "valley" vs "peak," or just signed numbers.
- **Defaults**: Stay on the negative/smoothing direction by default (preserves current behavior); positive is opt-in.

## Acceptance

- User can flip the saturation curve into a midtone-boost shape.
- Curve visualization reflects the active polarity.
- Existing default behavior is unchanged for users who don't toggle it.

## Related

- EPIC-0010 (interactive curve editing) — once the curve is editable, polarity becomes one degree of freedom among several.
