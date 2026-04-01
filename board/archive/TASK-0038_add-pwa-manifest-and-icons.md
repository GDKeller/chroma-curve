---
type: task
status: done
priority: 3
created: 2026-03-31
parent: TASK-0032
---

# TASK-0038: Add PWA manifest and icons

Create `manifest.webmanifest` and generate PWA icon variants.

## Files

- `manifest.webmanifest` — app metadata + icon declarations
- `icon-192.png` — 192x192 (purpose: `any`)
- `icon-512.png` — 512x512 (purpose: `any`)
- `icon-maskable-192.png` — 192x192 (purpose: `maskable`)
- `icon-maskable-512.png` — 512x512 (purpose: `maskable`)

## Notes

- Maskable icons: content within 40% radius safe zone, solid background. Test at maskable.app
- Never combine `"purpose": "any maskable"` on a single icon — use separate files
- Manifest fields: `name`, `short_name`, `start_url`, `display`, `background_color`, `theme_color`
- `background_color` and `theme_color` should be `#0a0a0a` (dark theme)

## Ref

- NOTE-0024 (favicon spec compliance)
