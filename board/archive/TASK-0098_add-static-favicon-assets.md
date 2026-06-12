---
type: task
status: done
priority: 2
created: 2026-05-06
archived: 2026-05-07
parent: EPIC-0020
---

# TASK-0098: Add static favicon assets to fix /favicon.ico 404

> **Pre-resolved — archived 2026-05-07.** This task was created in error during the NOTE → TASK extraction pass on 2026-05-06. The premise (favicon 404) was stale: the favicon stack already shipped via TASK-0032 / TASK-0036 / TASK-0040 / TASK-0043 (all in `archive/`), and `app/public/` already contains `favicon.ico`, `favicon.svg`, `favicon-48x48.png`, `apple-touch-icon.png`, `icon-{192,512}.png`, `icon-maskable-{192,512}.png`, `manifest.webmanifest`, and `og-image.png`. The live site returns HTTP 200 for `/favicon.ico` and `/favicon.svg`. The originating NOTE-0010 item #5 was outdated; future extractions should verify NOTE claims against the codebase before creating tasks. Status set to `done` (the only valid terminal status per the board spec) since the underlying acceptance criteria are already satisfied — not because new work shipped under this task.

## Original body

The site currently 404s on `/favicon.ico`. `useDynamicFavicon` swaps the favicon at runtime once the app hydrates, but a static fallback is needed for the initial paint and for crawlers/feeds.

### Acceptance

- `/favicon.ico` and `/favicon.svg` exist in `public/` and are served on first paint.
- Dark-mode-friendly default that works before hydration.
- `useDynamicFavicon` continues to overlay the live palette favicon after hydration without regression.

### Source

- NOTE-0010 (#5)

### Related

- TASK-0068 — verify `useDynamicFavicon` fires after hydration (Astro migration).
