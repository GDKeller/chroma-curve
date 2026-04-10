---
type: epic
status: planning
created: 2026-04-06
updated: 2026-04-09
---

# EPIC-0013: Migrate to Astro for SSG and marketing pages

Migrate the app from client-only Vite + React to Astro with React islands. Solves the original crawler-visibility problem (see NOTE-0029) and adds a native content platform for marketing pages.

## Context

Two drivers converged on this plan:

1. **Crawler visibility.** All page content is currently rendered client-side, so crawlers and LLMs see an empty shell. Originally scoped to `vite-react-ssg` in the first version of this epic.
2. **Marketing pages.** We want room for `/about`, `/how-it-works`, `/examples`, and eventually a blog. `vite-react-ssg` is a pre-rendering wrapper, not a content platform — Astro is the natural fit and already the preferred content framework per global tooling docs.

## Key decisions

**Tool-first at `/`.** The palette generator stays at the root URL. A marketing wall between users and the tool would add friction with no payoff — Chroma Curve is a free instrument and the tool *is* the pitch. Marketing content lives at sibling routes (`/about`, `/how-it-works`, etc.). Matches patterns from Coolors, tldraw, Excalidraw, and remove.bg.

**SSR'd layout, hydrated island.** The `/` page has an Astro layout (header nav, SEO meta, `sr-only` h1 and description) wrapping a `<PaletteGenerator client:load />` island. Crawlers get real HTML with rich semantics; sighted users get the clean tool interface with a visible path to info pages via the header nav.

**`client:load`, not `client:only`.** We want the initial render SSR'd so crawlers see the default palette, not a skeleton. The Zustand store has static defaults and the browser-only code paths are already confined to `useEffect` and event handlers, so this is achievable with a focused hydration audit.

**Scaffold alongside, swap at the end.** Build the Astro project in a sibling directory to `app/`, bring it to parity, then swap. Keeps `app/` buildable and shippable throughout the migration.

**Dedicated branch.** This is a sizeable restructure and will live on its own branch off `main`, landed separately from any in-flight feature work.

## Dependencies

- **TASK-0059** (About.tsx refactor into feature directory) is a prerequisite for porting components. Priority bumped from P3 to P1 so it lands before the Astro migration starts. The 912-line monolith is significantly harder to move than 12 modular files.

## Tasks

### Prerequisite
- TASK-0059: Refactor About.tsx into `about/` feature directory *(belongs to EPIC-0004 but blocks TASK-0065)*

### Scaffolding and configuration
- TASK-0060: Scaffold Astro project alongside `app/`
- TASK-0061: Port Tailwind 4 config and `@theme` tokens to Astro
- TASK-0062: Port Typekit fonts and favicons into Astro root layout
- TASK-0063: Build root `<Layout>` with SSR'd header nav and SEO meta

### App port
- TASK-0064: Create `/` page with React island and sr-only SEO content
- TASK-0065: Port React components into palette generator island
- TASK-0049: Audit React island hydration for browser-only code
- TASK-0066: Verify Framer Motion behavior under Astro hydration
- TASK-0067: Verify Radix portals work inside React island
- TASK-0068: Verify `useDynamicFavicon` fires after hydration

### Marketing pages (stubs)
- TASK-0069: Create stub `/about`, `/how-it-works`, `/examples` pages

### Crawler signals and validation
- TASK-0051: Add robots.txt and sitemap.xml (with all Astro routes)
- TASK-0052: Verify og-image.png exists in public/
- TASK-0050: Validate Astro build output and browser smoke test
- TASK-0070: Update Cloudflare Pages config for Astro `dist/` output
- TASK-0071: Lighthouse and view-source crawler verification

## Out of scope

- Writing real marketing copy (stub pages only; real content is a follow-up)
- MDX / content collections setup (add when we have content to organize)
- Analytics, conversion tracking, funnel work
- Changing the visual design of the tool itself
