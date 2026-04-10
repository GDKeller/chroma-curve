---
type: task
status: backlog
priority: 2
created: 2026-04-06
updated: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0069
---

# TASK-0051: Add robots.txt and sitemap.xml

Add standard crawler signal files to the Astro project's `public/` directory so search engines and LLMs can discover and index the site — including the new marketing routes.

## Files to create

### `public/robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://chromacurve.style/sitemap.xml
```

### `public/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chromacurve.style/</loc></url>
  <url><loc>https://chromacurve.style/about</loc></url>
  <url><loc>https://chromacurve.style/how-it-works</loc></url>
  <url><loc>https://chromacurve.style/examples</loc></url>
</urlset>
```

## Alternative: Astro sitemap integration

Consider `@astrojs/sitemap` (`npx astro add sitemap`) which auto-generates `sitemap-index.xml` from the project's pages. This removes the manual-maintenance burden as marketing pages are added. Evaluate during implementation — the static file above is fine for a small site and has zero dependencies.

## Verification

- [ ] `curl https://chromacurve.style/robots.txt` returns the file with the sitemap pointer
- [ ] `curl https://chromacurve.style/sitemap.xml` returns the sitemap with all routes
- [ ] Each `<loc>` URL returns a 200 with real content
