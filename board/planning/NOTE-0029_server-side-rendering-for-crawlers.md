---
type: note
status: inbox
created: 2026-04-06
---

# Server-side rendering for crawlers and LLMs

## Decision (2026-04-09): Superseded by Astro migration

After this note was written, the scope expanded: we also want marketing pages (`/about`, `/how-it-works`, `/examples`), not just a single pre-rendered route. `vite-react-ssg` is a pre-rendering wrapper, not a content platform — it would force us to build marketing pages as React components with no content-collections story.

**Chosen path:** Migrate to Astro with the palette tool as a `client:load` React island at `/` and marketing routes as native Astro pages. Preserves the crawler-visibility goal below while providing a content platform for marketing work. The tool stays at `/` (tool-first, not marketing-first at root) so the clinical-instrument UX is preserved.

See EPIC-0013 for the migration plan. The research below is retained as historical context.

---

## Original research

All page content is currently rendered client-side, so crawlers and LLMs see an empty shell. We need SSG for the home page (the only page that exists).

## Recommended approach

[`vite-react-ssg`](https://vite-react-ssg.netlify.app/docs/Getting-Started) — light lift, stays within the existing Vite + React stack. Pre-renders the home page at build time so the HTML is crawlable without JS execution.

## Current setup

- Single-page app: `main.tsx` uses `createRoot` (client-only rendering)
- No router — `App.tsx` renders one page directly
- Vite config is minimal: `@vitejs/plugin-react` + `@tailwindcss/vite`
- Framer Motion `MotionConfig` wraps the app at the root level

## Library details (v0.9.0)

- **Not a Vite plugin** — it's a CLI wrapper (`vite-react-ssg build`) + entry point library
- **Single-page mode**: import from `vite-react-ssg/single-page` — does NOT require react-router-dom
- **React 19**: supported since v0.8.5, hydration fix in v0.8.7
- **Vite 7**: supported since v0.8.8
- **Hydration**: uses `hydrateRoot` internally, fully automatic

## Migration summary

1. Install: `npm i -D vite-react-ssg`
2. Update build script: `vite build` → `vite-react-ssg build`
3. Replace `createRoot` in `main.tsx` with `ViteReactSSG()` from `vite-react-ssg/single-page`
4. No Vite plugin changes, no router needed, no browser-only guards needed

## Browser-only code audit (all safe)

- `useDynamicFavicon` — all APIs inside `useEffect`
- `useCopyToClipboard` — inside async callback
- `export.ts` — inside user-triggered function
- `TargetSwatch.tsx` — inside ref callback + `useEffect`
- Radix portals render client-only (expected, dialog content isn't crawler-relevant)
- Zustand store is pure with static defaults — deterministic SSG output

## What crawlers will see

After SSG, the pre-rendered HTML will include the full default palette grid, swatch values, header, and control labels. Interactive state changes (hue/saturation adjustments) remain client-side, which is fine — crawlers get the meaningful content.
