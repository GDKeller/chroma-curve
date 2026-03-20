---
type: task
status: backlog
priority: 2
created: 2026-03-20
parent: EPIC-0006
blocked_by:
  - TASK-0024
tags:
  - oklch-migration
---

# TASK-0026: Tune default sMod for OKLCH

Visual review of default `sMod=70` in OKLCH context. The old default was calibrated for HSL's large perceptual distortion — in OKLCH the same value may over-correct since the baseline is already perceptually even.

- Test across multiple hues (red, yellow, blue, green) at various saturation levels
- Compare with curve off (sMod→∞ / pct=0%) to gauge correction magnitude
- Adjust default to give a visible but subtle refinement
- Document the chosen value and rationale
