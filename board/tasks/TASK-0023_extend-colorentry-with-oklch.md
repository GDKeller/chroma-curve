---
type: task
status: backlog
priority: 1
created: 2026-03-20
parent: EPIC-0006
tags:
  - oklch-migration
---

# TASK-0023: Extend ColorEntry type with OKLCH fields

Add `oklch: { L: number; C: number; H: number }` to the `ColorEntry` type in `app/src/types/palette.ts`.

Keep all existing fields (`lightness`, `hsl`, `hslString`, `hex`, `label`) — they remain used by charts (`toSvgX` assumes 0–100 lightness), export (label as token key), and display. The `lightness` field stays as integer 0–100 (OKLCH L scaled up). No downstream breakage.
