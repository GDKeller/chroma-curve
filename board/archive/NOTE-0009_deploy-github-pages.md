---
type: note
status: processed
created: 2026-03-25
updated: 2026-03-30
---

# Deploy to Cloudflare Pages

Deployed via Cloudflare Pages (not GitHub Pages as originally planned).

## Live URLs

- **Primary:** [chromacurve.style](https://chromacurve.style)
- **Alternate:** [chromacurve.app](https://chromacurve.app)
- **Portfolio subdomain:** [chromacurve.grantkeller.dev](https://chromacurve.grantkeller.dev)

## Setup

- Cloudflare Pages project: `chroma-curve`
- Build command: `cd app && npm run build`
- Output directory: `app/dist`
- Wrangler config: `wrangler.jsonc` at project root
- Root `package.json` has `deploy` and `preview` scripts
- `app/public/_headers` for security headers and asset caching
- GitHub repo: [GDKeller/chroma-curve](https://github.com/GDKeller/chroma-curve)

## DNS

- `chromacurve.grantkeller.dev`: CNAME on Cloudflare (grantkeller.dev zone)
- `chromacurve.style`: apex CNAME via Cloudflare flattening
- `chromacurve.app`: apex CNAME via Cloudflare flattening
