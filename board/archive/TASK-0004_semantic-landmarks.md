---
type: task
created: 2026-03-16
status: done
epic: EPIC-0001
priority: medium
refs: [UX-8, UX-9, UX-14]
---

# Add semantic landmarks to shell components

Screen readers cannot navigate by landmarks. The app has no `<main>`, the control bar has no `<nav>`, and the palette strip is neither marked decorative nor labeled.

## Requirements

- `AppShell.tsx`: Change root `<div>` to `<main>` or wrap content in `<main>`
- `ControlBar.tsx`: Wrap in `<nav aria-label="Palette controls">` or add `role="region"` with label
- `PaletteStrip.tsx`: Add `aria-hidden="true"` to container (decorative overview strip)

## Files to modify

- `app/src/components/AppShell.tsx`
- `app/src/components/controls/ControlBar.tsx`
- `app/src/components/palette/PaletteStrip.tsx`
