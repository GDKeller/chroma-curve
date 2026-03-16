---
type: epic
created: 2026-03-16
status: open
---

# Code Quality & Cleanup

Address code quality findings: undocumented critical guards, fragile module-level ordering, anti-pattern hook returning JSX, duplicated chart infrastructure, and minor cleanup items.

## Scope

- Document `getSaturation` division-by-zero guard (CQ-1)
- Reorder About.tsx module-level constants by dependency (CQ-2)
- Refactor `useCurvePickerVisuals` to return data instead of JSX (CQ-4)
- Extract shared chart infrastructure from SaturationCurve and EffectiveSaturation (CQ-5)
- Fix miscellaneous issues: magic number coupling, redundant rounding, empty div spacers, missing React import, index keys (CQ-10, CQ-12, CQ-13, CQ-14, CQ-15)

## Tasks

- TASK-0012
- TASK-0013
- TASK-0014
- TASK-0015
