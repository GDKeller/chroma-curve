---
type: task
status: backlog
priority: 1
created: 2026-03-20
parent: EPIC-0006
blocked_by:
  - TASK-0021
tags:
  - oklch-migration
---

# TASK-0025: Implement hue-aware saturation-to-chroma mapping

Map the existing Saturation slider (0–1 float in store) to OKLCH chroma:

- 100% = `maxChromaInSrgb(L_ref, hue)` where `L_ref` is the hue's peak lightness from `PEAK_L_BY_HUE`
- Linear interpolation from 0 to that max
- satMode interaction:
  - **endpoint mode**: reference lightness = endpoint lightness values (lMin/lMax)
  - **target mode**: reference lightness = vertex lightness (peak for hue)
- Store value stays 0–1 float — the mapping to absolute chroma happens in `generateNeutrals`
