---
type: task
status: backlog
priority: 2
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0063
---

# TASK-0069: Create stub marketing pages

Create placeholder Astro pages for the header nav destinations so the nav links resolve and the site structure is in place. Real content is deferred — this task creates the routes, layouts, and minimal placeholder content only.

## Pages to create

- `src/pages/about.astro` — What Chroma Curve is, who it's for, why the curve matters
- `src/pages/how-it-works.astro` — The parabolic saturation curve, the math, the Desmos link
- `src/pages/examples.astro` — Gallery of generated palettes (stubbed with a placeholder for now)

## Placeholder content

Each page:

- Uses the root `<Layout>` with appropriate per-page `title` and `description`
- Has a single `<h1>` and 2–3 paragraphs of placeholder copy
- Uses the existing design tokens (`text-text-primary`, `surface-base`, etc.) for consistency with the tool
- Is pure Astro — no React islands
- Constrains content to a readable max-width (e.g. `max-w-2xl mx-auto px-6 py-16`)

## Out of scope

- Real marketing copy (tracked as a follow-up task)
- MDX or content collections (add when the site has multiple posts)
- Image assets, diagrams, or interactive demos
- Pricing, testimonials, or conversion affordances (this is a free tool)

## Verification

- [ ] Clicking each header nav link navigates to the corresponding page
- [ ] Each page's view-source shows the expected content
- [ ] All pages inherit favicons, fonts, and theme correctly
- [ ] Back-navigation to `/` rehydrates the palette generator without errors
