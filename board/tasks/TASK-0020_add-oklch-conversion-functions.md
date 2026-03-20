---
type: task
status: backlog
priority: 1
created: 2026-03-20
parent: EPIC-0006
tags:
  - oklch-migration
---

# TASK-0020: Add OKLCH conversion functions

Create `app/src/lib/oklch.ts` with the zero-dependency conversion pipeline from NOTE-0006:

- `srgbToLinear` / `linearToSrgb`
- `linearSrgbToOklab` / `oklabToLinearSrgb`
- `oklabToOklch` / `oklchToOklab`
- `oklchToSrgb` / `srgbToOklch`
- `srgbToHex` / `srgbToHsl`
- `isInSrgbGamut`

These are pure math functions with no dependencies on chroma-js or the rest of the codebase. Keep chroma-js for non-generation uses (contrast, export conversion, About).
