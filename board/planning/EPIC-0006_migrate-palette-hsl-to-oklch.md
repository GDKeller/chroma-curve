---
type: epic
status: planning
created: 2026-03-20
tasks:
  - TASK-0020
  - TASK-0021
  - TASK-0022
  - TASK-0023
  - TASK-0024
  - TASK-0025
  - TASK-0026
tags:
  - oklch-migration
---

# EPIC-0006: Migrate palette generation from HSL to OKLCH

Migrate all internal color math from HSL to OKLCH. The parabolic correction curve shifts from a necessity (compensating for HSL's perceptual brokenness) to an opt-in artistic refinement. Gamut-aware chroma clamping replaces hard clipping. Hue-dependent center shift makes the curve smarter.

## Scope

- OKLCH conversion functions (custom, not culori — keep chroma-js for non-generation uses)
- Memoized sRGB gamut boundary lookup (per-hue cache, 101 lightness steps)
- Hue-dependent chroma correction with both endpoint and target satMode
- Hue-aware saturation→chroma slider mapping (100% = max gamut chroma for current hue)
- Refactored `generateNeutrals` producing OKLCH internally, deriving HSL/hex at output
- Labels stay `grey-{0–100}` (OKLCH lightness scaled to integer)
- Visual tuning of default sMod for OKLCH context

## Key decisions

- **satMode** carries forward (both endpoint and target)
- **chroma-js** stays for contrast, export conversion, About — OKLCH math is additive
- **sMod/p** parameter mapping unchanged (`pctToSMod` stays as-is)
- **Curve defaults to on** — hue-dependent center shift is the new default experience
- **About dialog** is a separate deferred effort (EPIC-0008)

## Reference

- NOTE-0006: Full migration guide with conversion functions, formulas, and checklist
- REFE-0001: Parabolic saturation curve background
