---
type: task
status: done
priority: 1
epic: EPIC-0014
created: 2026-04-06
completed: 2026-04-10
---

# TASK-0057: Redesign TargetSwatch popover content and persistent indicator

**Popover**: Replace "Input"/"H+S at L50" labels with arrow notation (`#FF5733 → #BF4040`) and `text-4xs` annotation "hue + saturation at L50". Canvas picker clears target before applying new pick.

**Trigger button**: When target active + not drifted: chromatic swatch ring (target hue), hex label at `text-text-secondary`. When drifted: neutral ring, dimmed indicator. Clear (X) button on hover when target active, calls `clearTarget()`.

Derived `targetDrifted` computed as `targetInput !== null && (hue !== targetHue || saturation !== targetSat)`.

## Files

- `app/src/components/controls/TargetSwatch.tsx`
