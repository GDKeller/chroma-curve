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

# TASK-0027: Migrate SaturationCurve to chromaCorrection

Update `SaturationCurve.tsx`:

- Replace `getSaturation()` calls with `chromaCorrection()` for curve drawing (the 0–100 sampling loop)
- Pass `hue` (already available from store) to `chromaCorrection()`
- Update the "Unadjusted" comparison strip (line ~68) to generate flat OKLCH chroma colors instead of `chroma.hsl()` — this strip shows what the palette looks like without correction
- Reference the memoized gamut boundary cache from TASK-0021 if needed for the comparison strip
