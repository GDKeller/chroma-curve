---
type: note
status: inbox
created: 2026-04-06
---

# Server-side rendering for crawlers and LLMs

All page content is currently rendered client-side, so crawlers and LLMs see an empty shell. We need SSR/SSG for the home page (the only page that exists).

## Recommended approach

[`vite-react-ssg`](https://vite-react-ssg.netlify.app/docs/Getting-Started) — light lift, stays within the existing Vite + React stack. Pre-renders the home page at build time so the HTML is crawlable without JS execution.

## Current setup

- Single-page app: `main.tsx` uses `createRoot` (client-only rendering)
- No router — `App.tsx` renders one page directly
- Vite config is minimal: `@vitejs/plugin-react` + `@tailwindcss/vite`
- Framer Motion `MotionConfig` wraps the app at the root level

## Migration considerations

- `vite-react-ssg` replaces `createRoot` with its own entry point; the main change is in `main.tsx`
- Single-route app so routing setup is trivial (one route: `/`)
- `usePalette` reads from Zustand store and computes colors — palette generation is deterministic from defaults, so SSG can capture the initial render
- `useDynamicFavicon` manipulates `<link>` tags in the DOM — needs to be guarded or deferred to client-only execution
- Framer Motion works with SSR but animations will hydrate on the client
- Charts (canvas-based via `ChartTabs`) may need lazy/client-only rendering if they depend on `window` or `document`

## What crawlers will see

After SSG, the pre-rendered HTML will include the full default palette grid, swatch values, header, and control labels. Interactive state changes (hue/saturation adjustments) remain client-side, which is fine — crawlers get the meaningful content.
