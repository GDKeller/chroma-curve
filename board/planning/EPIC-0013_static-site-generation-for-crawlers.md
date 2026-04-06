---
type: epic
status: planning
created: 2026-04-06
---

# EPIC-0013: Add static site generation for crawler visibility

All page content is currently rendered client-side, so crawlers and LLMs see an empty shell. Add SSG via `vite-react-ssg` to pre-render the home page at build time.

## Context

- Single-page app, one route (`/`)
- Zustand store has static defaults — SSG captures a meaningful initial render
- Charts are SVG-based, no canvas concerns
- All browser API usage is inside `useEffect` or event handlers (no top-level side effects)
- See NOTE-0029 for initial research

## Tasks

- TASK-0047: Install vite-react-ssg and configure Vite plugin
- TASK-0048: Migrate main.tsx entry point to SSG
- TASK-0049: Audit and guard browser-only code paths for SSG safety
- TASK-0050: Validate build output contains pre-rendered HTML
