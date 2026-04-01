---
type: task
status: in-progress
priority: 2
created: 2026-03-31
---

# TASK-0032: Add favicon

Add a favicon to the Chroma Curve site following modern best practices (SVG preferred, with ICO/PNG fallbacks as needed).

## Design Direction

Primary concept: a color picker gradient background (white-to-hue horizontal, transparent-to-black vertical) with a parabolic "C" curve overlaid in solid white with drop shadow. Rounded square frame with subtle dark border.

## Completed

- [x] SVG favicon (`app/public/favicon.svg`)
- [x] Dynamic favicon hook (`useDynamicFavicon`) — updates hue in real-time
- [x] Link tag in `index.html`

## Remaining (see child tasks)

- TASK-0036: Generate ICO/PNG favicon variants
- TASK-0037: Add Apple touch icon
- TASK-0038: Add PWA manifest and icons
- TASK-0039: Add OG image for social sharing
- TASK-0040: Wire all favicon/meta tags in index.html

## Nice-to-Have

- **Dynamic favicon based on selected hue** — implemented via `useDynamicFavicon` hook.
