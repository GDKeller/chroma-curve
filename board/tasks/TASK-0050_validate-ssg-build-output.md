---
type: task
status: backlog
priority: 2
created: 2026-04-06
parent: EPIC-0013
blocked_by: TASK-0048,TASK-0049
---

# TASK-0050: Validate build output contains pre-rendered HTML

Run the production build and verify the SSG output is correct and hydration works in the browser.

## Validation checklist

### Build output (`app/dist/index.html`)

- [ ] `<div id="root">` contains rendered markup (palette grid, header, control labels, swatch values) — not an empty div
- [ ] `<head>` meta tags survived (title, OG tags, Twitter card, favicons, Typekit link)
- [ ] Tailwind CSS stylesheet `<link>` is present and populated with utility classes
- [ ] Script tag references the hydration bundle

### Browser smoke test

- [ ] Run `npx vite preview` in `app/` and load in browser
- [ ] Page renders correctly with full palette
- [ ] No React hydration mismatch warnings in console
- [ ] No `window is not defined` or `document is not defined` errors in console
- [ ] Interactive controls work after hydration (hue slider, saturation, export)
- [ ] Framer Motion animations fire on client (dialog open/close, AnimatePresence)
- [ ] Dynamic favicon updates after hydration

### Deployment

- [ ] Cloudflare Pages deployment works unchanged (`pages_build_output_dir: "app/dist"`)
- [ ] Run `wrangler pages dev app/dist` for local deployment smoke test
