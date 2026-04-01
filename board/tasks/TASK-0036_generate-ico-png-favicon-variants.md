---
type: task
status: done
priority: 2
created: 2026-03-31
parent: TASK-0032
---

# TASK-0036: Generate ICO/PNG favicon variants

Generate raster favicon files from the existing SVG design.

## Files

- `favicon.ico` — 32x32 (or multi-resolution 16x16 + 32x32)
- `favicon-48x48.png` — 48x48 (Google Search minimum requirement)

## Notes

- ICO must live at site root (`/favicon.ico`) — some RSS readers and crawlers hardcode this path
- Use the default hue (220) for static variants
- Optimize PNGs with OxiPNG or Squoosh

## Ref

- NOTE-0024 (favicon spec compliance)
