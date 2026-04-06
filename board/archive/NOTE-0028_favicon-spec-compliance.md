---
type: note
status: processed
created: 2026-03-31
---

# NOTE-0028: Favicon & Web Icon Spec Compliance

Comprehensive reference for all favicon/icon assets needed for modern best practices. Research conducted 2026-03-31.

## Current State

- SVG favicon exists (`app/public/favicon.svg`) — color picker gradient with parabolic "C" curve
- Dynamic favicon hook (`useDynamicFavicon`) updates SVG hue in real-time
- Link tag in `index.html` for SVG only

## Files Needed

| File | Size | Format | Purpose | Status |
|---|---|---|---|---|
| `favicon.ico` | 32x32 (or 16+32 multi) | ICO | Legacy browsers, RSS readers, crawlers | Missing |
| `favicon.svg` | Vector | SVG | Modern browsers | Done |
| `favicon-48x48.png` | 48x48 | PNG | Google Search results (minimum 48px required) | Missing |
| `apple-touch-icon.png` | 180x180 | PNG (opaque) | iOS home screen, Siri, Spotlight | Missing |
| `icon-192.png` | 192x192 | PNG | Android home screen, PWA install | Missing |
| `icon-512.png` | 512x512 | PNG | PWA splash screen, high-res displays | Missing |
| `icon-maskable-192.png` | 192x192 | PNG | Android adaptive icons (needs safe zone padding) | Missing |
| `icon-maskable-512.png` | 512x512 | PNG | Android adaptive icons (needs safe zone padding) | Missing |
| `manifest.webmanifest` | — | JSON | PWA manifest declaring icons + app metadata | Missing |
| `og-image.png` | 1200x630 | PNG | Social sharing (Facebook, Twitter, Slack, etc.) | Missing |

## HTML Tags Required

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0a0a0a">
```

Note: `sizes="32x32"` on the ICO link fixes a Chrome bug where it prefers ICO over SVG.

## Design Constraints

- **Maskable icons**: Content must fit within a centered circle of 40% radius. Separate files from regular icons — never use `"purpose": "any maskable"`.
- **Apple touch icon**: Must be opaque (no transparency — iOS fills transparent areas with black). Add ~20px padding with solid background.
- **OG image**: Separate design task, 1200x630 social preview card. Keep important content within central 1080x566 safe zone.
- **Dynamic favicon**: The `useDynamicFavicon` hook overrides the SVG at runtime — static files serve as fallbacks for non-JS contexts.

## Deprecated / Not Needed

- Safari pinned tab (`mask-icon`) — obsolete since Safari 12
- Windows tiles / `browserconfig.xml` — legacy IE/Win8
- Multiple Apple touch icon sizes — single 180x180 sufficient
- `rel="shortcut icon"` — `shortcut` was never a valid relation
- Opera Coast (228x228) — browser discontinued 2017
