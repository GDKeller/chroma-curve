---
type: task
created: 2026-03-16
status: done
epic: EPIC-0003
priority: 3
refs: [CQ-7]
---

# Defer formatPalette until export dialog is open

`ExportDialog` calls `formatPalette(entries, format, space)` on every render, even when `open === false`. Since the dialog is always mounted in the Header, this runs on every store update.

## Requirements

- Wrap in `useMemo` keyed on `[entries, format, space]`
- Or conditionally compute only when `open === true` (return empty string when closed)
- The second approach is slightly better since it avoids even memoized computation when the dialog is never opened

## Files to modify

- `app/src/components/export/ExportDialog.tsx`
