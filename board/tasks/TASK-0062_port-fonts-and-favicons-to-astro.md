---
type: task
status: backlog
priority: 1
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0060
---

# TASK-0062: Port Typekit fonts and favicons into Astro root layout

Move the `<head>` resources from `app/index.html` into the Astro root layout (`src/layouts/Layout.astro`). Everything that should appear on every page goes here; per-page title/description/OG is covered by the layout's prop API in TASK-0063.

## Resources to port

- Typekit stylesheet: `<link rel="stylesheet" href="https://use.typekit.net/nbx6xju.css" />`
- Favicons: `favicon.ico`, `favicon.svg`, `favicon-48x48.png`, `apple-touch-icon.png`
- PWA manifest: `manifest.webmanifest`
- Theme color meta: `#0a0a0a`
- Charset and viewport meta

## Public assets

Copy from `app/public/` to `app-astro/public/`:

- `favicon.ico`
- `favicon.svg`
- `favicon-48x48.png`
- `apple-touch-icon.png`
- `manifest.webmanifest`

(`og-image.png` existence is verified separately by TASK-0052.)

## Verification

- [ ] `dist/index.html` contains the Typekit `<link>` and all favicon references
- [ ] Acumin Pro, Unbounded, and Recursive Sans Linear Static render correctly in the browser on any page
- [ ] Favicon shows in browser tab on initial load (before dynamic favicon kicks in — see TASK-0068)
- [ ] No CORS or 404 errors in the network tab for fonts
