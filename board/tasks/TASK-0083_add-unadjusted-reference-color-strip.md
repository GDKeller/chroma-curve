---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0012
---

# TASK-0083: Add unadjusted reference color strip above adjusted strip

Add a second color strip above the existing large color strip that shows the **unadjusted** palette — i.e., the palette as it would be without the parabolic saturation curve applied. The adjusted strip stays where it is; the unadjusted strip sits directly above as a comparison reference.

## Why

The whole point of Chroma Curve is the perceptual improvement from the curve. Right now the user sees only the *result* and has to take it on faith. Showing the unadjusted version inline turns the difference into a visible, side-by-side proof — which:

- Makes the curve's effect tangible at a glance.
- Reinforces "show the math" as a first-class design principle.
- Helps users tune the saturation amount by seeing exactly what the curve is taking away (or, with TASK-0080, adding).

## Acceptance

- A reference strip rendering the unadjusted palette appears directly above the existing color strip.
- Both strips update live as hue, saturation, lightness range, etc. change.
- Visual treatment makes clear which strip is the reference and which is the result. The reference shouldn't compete for attention but should be clearly readable.
- Strip height/sizing is balanced — the existing strip should remain the dominant element.

## Design questions

- Label the reference strip? ("unadjusted," "raw," "before") or rely on visual hierarchy alone?
- Should the reference strip respect the current swatch count and lightness range, or always show a fixed reference scale?
- How does this interact with TASK-0080's polarity flip — does "unadjusted" still mean curve-off, or does it mean "before this polarity's adjustment"?

## Related

- TASK-0080 (positive saturation inversion) — both expose the curve's effect; design these together.
- Design Principle #3 ("show the math") in CLAUDE.md.
