---
type: task
status: backlog
priority: 2
created: 2026-04-06
updated: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0065,TASK-0049
---

# TASK-0050: Validate Astro build output and browser smoke test

Run the production Astro build and verify the output is correct: meta tags intact, pre-rendered HTML contains real palette markup, hydration works in the browser, and every route produces a valid page.

## Build output checks (`dist/`)

- [ ] `dist/index.html` contains SSR'd palette markup (palette strip, palette grid, swatch values, header, control labels) — not an empty container
- [ ] The `sr-only` h1 and description paragraph are present in `dist/index.html`
- [ ] `<head>` meta tags survived: title, description, OG/Twitter cards, favicons, Typekit `<link>`
- [ ] Tailwind stylesheet is present with utility classes populated
- [ ] Island hydration script tag is present and points to the correct bundle
- [ ] Each marketing page (`dist/about/index.html`, `dist/how-it-works/index.html`, `dist/examples/index.html`) contains its own content

## Browser smoke test

- [ ] `npm run preview` (`astro preview`) and load `/` in the browser
- [ ] Full palette renders with no layout shift during hydration
- [ ] No hydration mismatch warnings in the console
- [ ] No `window is not defined` or `document is not defined` errors during build or runtime
- [ ] All interactive controls work: hue slider, saturation, lightness range, export dialog, about dialog
- [ ] Framer Motion animations fire on the client (dialog open/close, AnimatePresence transitions)
- [ ] Dynamic favicon updates after hydration
- [ ] Marketing pages navigate cleanly from the header nav, and back-navigation to `/` rehydrates correctly
