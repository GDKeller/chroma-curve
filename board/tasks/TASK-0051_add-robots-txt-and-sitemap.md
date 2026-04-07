---
type: task
status: backlog
priority: 2
created: 2026-04-06
parent: EPIC-0013
blocked_by: TASK-0050
---

# TASK-0051: Add robots.txt and sitemap.xml

Add standard crawler signal files to `app/public/` so search engines and LLMs can discover and index the site.

## Files to create

### `app/public/robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://chromacurve.style/sitemap.xml
```

### `app/public/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://chromacurve.style/</loc>
  </url>
</urlset>
```

Single-page app, single URL — the sitemap is minimal.
