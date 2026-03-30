---
type: note
created: 2026-03-25
---

# Deploy to GitHub Pages

Host Chroma Curve as a project site on GitHub Pages at `chromacurve.grantkeller.dev`.

---

## Steps

### Repo Setup
1. Create a new GitHub repo (under GDKeller) for chroma-curve
2. Add remote and push

### GitHub Actions Workflow
1. Add `.github/workflows/deploy.yml` to build from `app/` and deploy to Pages
2. Vite config doesn't need a `base` path change since we're using a custom domain (not a subpath)

### CNAME
1. Add `app/public/CNAME` containing `chromacurve.grantkeller.dev` (Vite copies `public/` to build output)

### Cloudflare DNS
1. Add a CNAME record in Cloudflare for `grantkeller.dev`:
   - Name: `chromacurve`
   - Target: `gdkeller.github.io`
   - Proxy status: DNS only (recommended for GitHub Pages)

### GitHub Repo Settings
1. Go to repo Settings → Pages
2. Set source to **GitHub Actions**
3. Custom domain will auto-verify once DNS propagates

## Notes
- The user site repo is `GDKeller.github.io` (portfolio at `grantkeller.dev`)
- GitHub Pages supports one user site + unlimited project sites per account
- HTTPS is provided automatically by GitHub Pages once domain is verified
