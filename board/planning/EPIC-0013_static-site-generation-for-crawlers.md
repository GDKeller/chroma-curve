---
type: epic
status: planning
created: 2026-04-06
---

# EPIC-0013: Add static site generation for crawler visibility

All page content is currently rendered client-side, so crawlers and LLMs see an empty shell. Add SSG via `vite-react-ssg` to pre-render the home page at build time.

## Context

- Single-page app, one route (`/`)
- `vite-react-ssg` is a CLI wrapper + entry point library (not a Vite plugin)
- Single-page mode (`vite-react-ssg/single-page`) works without react-router-dom
- Zustand store has static defaults — SSG captures a meaningful initial render
- Charts are SVG-based, no canvas concerns during render
- All browser API usage is inside `useEffect` or event handlers (verified — no guards needed)
- Cloudflare Pages deployment needs no changes (`app/dist/` output works as-is)
- See NOTE-0029 for initial research

## Tasks

### Core migration
- TASK-0047: Install vite-react-ssg and update build scripts
- TASK-0048: Migrate main.tsx entry point to SSG (single-page mode)
- TASK-0049: Verify browser-only code paths are SSG-safe
- TASK-0050: Validate build output contains pre-rendered HTML

### Crawler signals
- TASK-0051: Add robots.txt and sitemap.xml
- TASK-0052: Verify og-image.png exists in public/
