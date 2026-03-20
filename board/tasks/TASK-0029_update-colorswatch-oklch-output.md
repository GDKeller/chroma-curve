---
type: task
status: backlog
priority: 2
created: 2026-03-20
parent: EPIC-0007
blocked_by:
  - TASK-0023
tags:
  - oklch-migration
---

# TASK-0029: Update ColorSwatch for OKLCH output

Update `ColorSwatch.tsx`:

- Copy-on-click currently hardcodes `hsl(${entry.hslString})` — update to copy hex or OKLCH
- Tooltip currently shows HSL — update to show hex + OKLCH (or consider a format toggle)
- Shipping with hex as primary copy value is fine as a first pass
- If a format toggle is complex, defer it — the key change is making the copy target accurate to the new internal representation
