---
type: task
status: backlog
priority: 1
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0061,TASK-0062
---

# TASK-0063: Build root `<Layout>` with SSR'd header nav and SEO meta

Create `src/layouts/Layout.astro` — the root layout wrapping every page with SEO meta, header navigation, and the global stylesheet.

## Layout API

```astro
---
interface Props {
  title: string;
  description: string;
  ogImage?: string;
}
const { title, description, ogImage = "/og-image.png" } = Astro.props;
---
```

## Structure

- `<head>`: charset, viewport, title, description, OG/Twitter tags, favicons, Typekit, theme-color, global stylesheet
- `<body>`:
  - `<SiteHeader />` — Astro component with logo/wordmark and nav links
  - `<slot />` — page content
  - `<SiteFooter />` — optional, defer unless content warrants it

## Site header component

`src/components/SiteHeader.astro` — pure Astro, no React. Thin top bar matching the clinical-instrument aesthetic:

- Left: "Chroma Curve" wordmark linking to `/`
- Right: nav links — About, How it works, Examples, GitHub
- Typography: `text-sm`, `text-text-muted`, hover to `text-text-primary`
- Border: `border-b border-border-default`
- Backdrop: `backdrop-blur` with translucent `surface-base`
- Position: `sticky top-0 z-40`
- Height: ~48–56px so the tool dominates the viewport below

## Overlap with existing React `<Header>`

The existing `app/src/components/Header.tsx` is the tool's in-island header row (palette controls, app branding). The new Astro `<SiteHeader>` is the persistent site chrome. They serve different purposes but may look visually redundant stacked. Review during implementation whether to:

1. Keep both (site header + tool header stacked)
2. Merge into a single Astro header with tool-relevant affordances
3. Absorb the tool header's contents into `SiteHeader.astro`

Recommendation: start with option 1 and evaluate visually, then collapse if redundant.

## SEO

- Default `title` and `description` match the current values in `app/index.html`
- OG and Twitter tags templated from props
- JSON-LD `SoftwareApplication` or `WebApplication` structured data is a nice-to-have — defer unless cheap

## Verification

- [ ] `dist/index.html` contains the nav links as rendered HTML (view-source check)
- [ ] Every page's `<head>` is fully populated
- [ ] Nav links are keyboard-accessible with visible focus rings
- [ ] Header is sticky on scroll and readable over the palette background
