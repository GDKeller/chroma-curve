---
type: task
status: backlog
priority: 1
created: 2026-03-20
parent: EPIC-0006
blocked_by:
  - TASK-0020
tags:
  - oklch-migration
---

# TASK-0022: Add hue-dependent chroma correction

Implement the correction curve operating on OKLCH chroma:

- `PEAK_L_BY_HUE` lookup table (13 entries, linearly interpolated)
- `peakLightnessForHue(h)` — returns lightness (0–100) where hue reaches peak sRGB chroma
- `chromaCorrection(L, hue, p)` — parabolic multiplier with hue-dependent center point
- Support both satMode behaviors:
  - **endpoint**: multiplier = 1.0 at L=0 and L=100, dips at center (existing behavior ported)
  - **target**: multiplier normalized so vertex = 1.0 (slider controls center chroma)
