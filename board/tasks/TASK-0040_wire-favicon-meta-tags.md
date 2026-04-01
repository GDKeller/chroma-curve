---
type: task
status: done
priority: 2
created: 2026-03-31
parent: TASK-0032
---

# TASK-0040: Wire all favicon and meta tags in index.html

Add all required link and meta tags to `index.html` once icon assets are generated.

## Tags to Add

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0a0a0a">
```

## Notes

- `sizes="32x32"` on ICO link fixes Chrome bug where it prefers ICO over SVG
- Update existing OG/Twitter meta tags with `og:image` absolute URL
- Add `og:image:width`, `og:image:height`, `og:image:alt`
- Depends on: TASK-0036, TASK-0037, TASK-0038, TASK-0039

## Ref

- NOTE-0024 (favicon spec compliance)
