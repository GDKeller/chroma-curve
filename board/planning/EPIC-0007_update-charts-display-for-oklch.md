---
type: epic
status: planning
created: 2026-03-20
tasks:
  - TASK-0027
  - TASK-0028
  - TASK-0029
  - TASK-0030
tags:
  - oklch-migration
---

# EPIC-0007: Update charts and display for OKLCH

Migrate downstream UI that consumes palette data or independently calls `getSaturation()`. Charts need to switch to `chromaCorrection()`, EffectiveSaturation needs hue wired in, swatches and export need OKLCH-native output.

## Scope

- SaturationCurve: replace `getSaturation()` with `chromaCorrection()`, update unadjusted comparison strip
- EffectiveSaturation: wire `hue` from store, replace `getSaturation()` sampling
- ColorSwatch: update copy-on-click and tooltip for OKLCH/hex output
- Export: use `entry.oklch` directly instead of hex→OKLCH roundtrip

## Blocked by

EPIC-0006 (core generation must be migrated first)
