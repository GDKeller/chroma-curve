---
type: note
status: inbox
created: 2026-04-06
---

# Server-side rendering for crawlers and LLMs

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
