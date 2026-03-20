---
type: task
status: backlog
priority: 1
created: 2026-03-20
parent: EPIC-0007
blocked_by:
  - TASK-0022
tags:
  - oklch-migration
---

# TASK-0028: Migrate EffectiveSaturation and wire hue

Update `EffectiveSaturation.tsx`:

- Wire `hue` from the palette store (currently not consumed — only reads `sMod`, `saturation`, `satMode`)
- Replace `getSaturation()` sampling loop with `chromaCorrection()` calls
- Pass `hue` to `chromaCorrection()` for hue-dependent center shift
- Verify chart rendering still works with `toSvgX` (lightness stays 0–100 integer scale)
