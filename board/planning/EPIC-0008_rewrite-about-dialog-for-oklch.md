---
type: epic
status: planning
created: 2026-03-20
tasks:
  - TASK-0031
tags:
  - oklch-migration
  - deferred
---

# EPIC-0008: Rewrite About dialog for OKLCH

Post-migration polish. The About dialog contains an independent HSL implementation (educational strips, ColorPickerPlane, CurveGraph) that explains why HSL is broken. After core migration, reframe the educational narrative for OKLCH. Not a migration blocker — better to leave temporarily stale than rush an inaccurate rewrite.

## Blocked by

EPIC-0006 (core migration must land first)
