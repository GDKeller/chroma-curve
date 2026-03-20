---
type: task
status: backlog
priority: 1
created: 2026-03-20
parent: EPIC-0006
blocked_by:
  - TASK-0020
  - TASK-0021
  - TASK-0022
  - TASK-0023
tags:
  - oklch-migration
---

# TASK-0024: Refactor generateNeutrals to OKLCH internals

Rewrite `generateNeutrals` in `app/src/lib/palette.ts` to:

1. Iterate L from `lMin` to `lMax` (integer 0–100, same as today)
2. Convert L to OKLCH lightness (L/100)
3. Apply gamut-aware chroma clamping via memoized `maxChromaInSrgb` cache
4. Apply optional parabolic curve via `chromaCorrection()` (when sMod !== 0)
5. Derive RGB/hex/HSL at output boundary using OKLCH conversion functions
6. Populate `ColorEntry.oklch` with native OKLCH values
7. Keep `ColorEntry.lightness` as integer 0–100, `label` as `grey-{lightness}`

The `getSaturation()` function can be kept temporarily for chart compatibility (migrated in EPIC-0007) or removed if charts are updated simultaneously.
