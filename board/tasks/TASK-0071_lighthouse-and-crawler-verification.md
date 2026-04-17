---
type: task
status: backlog
priority: 2
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0070
---

# TASK-0071: Lighthouse and view-source crawler verification

Final verification pass confirming the migration achieved both goals: crawler visibility (the original NOTE-0029 problem) and marketing-page infrastructure for future growth.

## Crawler visibility checks

- [ ] `curl -s https://chromacurve.style/ | grep -i "chroma curve"` returns real content including the `sr-only` h1 and description
- [ ] View-source on `/` shows the full palette grid markup, not an empty container
- [ ] View-source on `/about`, `/how-it-works`, `/examples` shows their respective content
- [ ] `robots.txt` is served and references the sitemap
- [ ] `sitemap.xml` lists all Astro routes with 200 responses
- [ ] OG tags render correctly on social preview tools (e.g. opengraph.xyz, Twitter Card Validator)

## Lighthouse (run on `/` and at least one marketing page)

**Capture a current `app/` baseline first** for before/after comparison:

- [ ] Performance: score improves on the crawler-visible content (baseline is likely much lower due to empty-body SSR)
- [ ] Accessibility: no regression from current `app/` score
- [ ] Best Practices: clean
- [ ] SEO: target 100 (current is limited by the empty body)

## Acceptance criteria

- [ ] No console errors or warnings in production
- [ ] Hydration completes without a visible flash of unstyled or unhydrated content
- [ ] Palette generator is interactive within an acceptable time budget on a 4G-throttled connection
- [ ] All marketing nav links work from any page
- [ ] EPIC-0013 can be marked `done`
