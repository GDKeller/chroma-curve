---
type: task
status: backlog
priority: 2
created: 2026-03-20
updated: 2026-10-20
parent: EPIC-0007
blocked_by:
  - TASK-0023
tags:
  - oklch-migration
---

# TASK-0029: Update ColorSwatch for OKLCH output

> **Refreshed 2026-10-20.** The original first two bullets are already handled: a copy-format selector (hex / hsl / oklch, `CopyFormat` in `types/palette.ts`) shipped with TASK-0019 / TASK-0041, and `getCopyValue()` in `ColorSwatch.tsx` switches on it. The title now reads `"<label> - click to copy <FORMAT>"`. What remains is tied to the OKLCH migration itself.

Update `ColorSwatch/ColorSwatch.tsx`:

- **Native OKLCH copy value** — the `oklch` case currently calls `toOklchString(entry.hex)`, a lossy hex → OKLCH round-trip. After TASK-0023, read `entry.oklch` directly (mirror TASK-0030's change in `export.ts`).
- **Secondary value line** — the swatch body always renders `hsl({entry.hslString})` regardless of the selected copy format. Decide whether it should follow the active format or show OKLCH once that becomes the internal representation. Coordinate with TASK-0082 (highlight active copy format).
- **`hsl` copy case** — keep it working once `hslString` is derived from OKLCH rather than being the source of truth.
