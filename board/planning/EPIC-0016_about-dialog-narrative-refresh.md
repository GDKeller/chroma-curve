---
type: epic
status: planning
created: 2026-05-06
---

# EPIC-0016: About dialog narrative refresh

The About dialog currently frames Chroma Curve solely as a fix for a perceptual problem — fixed/static saturation produces uneven chroma, and the parabolic curve corrects it. That framing is accurate but incomplete:

1. It primes users to interpret the tool as **corrective only**, when the same curve mechanism enables genuinely creative palette shapes (vivid mids, muted mids, asymmetric scales).
2. The example labels ("Fixed low saturation," "Fixed high saturation") use *fixed* in the sense of "constant," but in a context all about correcting problems, *fixed* reads ambiguously as "corrected." This is exactly the wrong read.

## Goals

- Disambiguate the "fixed saturation" labels so the comparison strips clearly mean "constant/static," not "corrected."
- Extend the narrative beyond problem-solving to include the creative applications of the curve — both the default smoothing direction and (eventually) the inverted boost direction (TASK-0080).
- Keep the existing "show the math" rigor — this is a content layer on top, not a replacement.

## Out of scope

- The OKLCH rewrite (EPIC-0008 covers reframing for the post-migration mental model).
- Visual redesign of the dialog itself — copy and structure only.

## Tasks

- TASK-0084 — Disambiguate "fixed saturation" labels
- TASK-0085 — Add creative applications section

## Related

- EPIC-0008 — OKLCH rewrite of About dialog (separate, post-migration).
- TASK-0080 — Positive (inverted) saturation mode; the creative applications section will reference this once shipped.
