---
type: epic
status: planning
created: 2026-03-20
updated: 2026-11-04
tasks:
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

- OKLCH math through culori, which TASK-0020 adds in EPIC-0022
- Memoized sRGB gamut boundary lookup (per-hue cache, 101 lightness steps)
- Hue-dependent chroma correction with both endpoint and target satMode
- Hue-aware saturation→chroma slider mapping (100% = max gamut chroma for current hue)
- Refactored `generateNeutrals` producing OKLCH internally, deriving HSL/hex at output
- Labels stay `grey-{0–100}` (OKLCH lightness scaled to integer)
- Visual tuning of default sMod for OKLCH context

## Key decisions

- **satMode** carries forward (both endpoint and target)
- **culori** handles all OKLCH math (decided 2026-11-04, replacing the custom-functions plan; rationale in EPIC-0022). TASK-0020 in EPIC-0022 adds it, and TASK-0021, TASK-0022 and TASK-0024 wait on it. **chroma-js** stays for its remaining uses until EPIC-0009 removes it
- **sMod/p** parameter mapping unchanged (`pctToSMod` stays as-is)
- **Curve defaults to on** — hue-dependent center shift is the new default experience
- **About dialog** is a separate deferred effort (EPIC-0008)

## Reference

- REFE-0003: OKLCH color math — background for the conversions culori now provides, plus gamut search, peak-lightness table, correction formula
- NOTE-0006 *(archived)*: Original migration guide, including the "what changes / what doesn't" decisions and the migration checklist
- REFE-0001: Parabolic saturation curve background
