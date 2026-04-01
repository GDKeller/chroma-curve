---
type: task
status: done
priority: 2
created: 2026-03-31
parent: TASK-0032
---

# TASK-0037: Add Apple touch icon

Generate and add the Apple touch icon for iOS/iPadOS home screen bookmarks.

## Files

- `apple-touch-icon.png` — 180x180, opaque PNG (no transparency)

## Notes

- Add ~20px padding around icon content with solid dark background
- iOS auto-applies rounded corners and shadow — don't bake those in
- Place at site root for maximum compatibility
- Single 180x180 is sufficient — iOS downscales for all devices

## Ref

- NOTE-0024 (favicon spec compliance)
