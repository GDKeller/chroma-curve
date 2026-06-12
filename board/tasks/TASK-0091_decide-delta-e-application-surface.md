---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0019
---

# TASK-0091: Decide ΔE application surface

Planning task to pick where (and whether) ΔE2000 perceptual-distance scoring shows up in the UI before any implementation.

## Options to evaluate

- **About dialog quality demonstration** — a static comparison: ΔE evenness of the curve vs. fixed/static saturation.
- **Swatch hover badge** — show ΔE-to-neighbor on hover for any swatch.
- **Curve-summary badge** — a single number summarizing the palette's perceptual evenness.
- **Adaptive correction** — feed ΔE back into the curve to auto-correct hue-dependent unevenness (large effort, overlaps with EPIC-0006's lookup table).

## Acceptance

- Decision recorded for which surface(s) to ship, in what order.
- Adaptive-correction path scoped explicitly (size estimate, prerequisite EPICs).

## Source

- NOTE-0004
