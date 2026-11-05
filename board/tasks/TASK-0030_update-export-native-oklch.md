---
type: task
status: backlog
priority: 2
created: 2026-03-20
updated: 2026-11-04
parent: EPIC-0007
blocked_by:
  - TASK-0023
tags:
  - oklch-migration
---

# TASK-0030: Update export to use native OKLCH values

Update `export.ts`:

- The `oklch` color space case currently converts `entry.hex` → OKLCH via chroma-js, losing precision in the roundtrip
- After TASK-0023, `entry.oklch` has the original OKLCH floats — read directly instead of converting from hex
- Format as `oklch(L C H)` using the native values
- Format with the shared `oklch()` formatter from TASK-0134, so exports match the swatch and target-row strings
