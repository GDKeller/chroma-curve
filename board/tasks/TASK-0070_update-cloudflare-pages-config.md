---
type: task
status: backlog
priority: 2
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0050
---

# TASK-0070: Update Cloudflare Pages config for Astro `dist/` output

Cloudflare Pages is currently configured with `pages_build_output_dir: "app/dist"`. After the Astro migration and directory swap, the build output path and build command may need updating depending on the final directory structure.

## Checks

- [ ] Locate `wrangler.toml` / `wrangler.jsonc` (repo) or the Pages project dashboard config
- [ ] Confirm `pages_build_output_dir` matches Astro's output path post-swap (likely still `app/dist` if the swap leaves the Astro project at `app/`)
- [ ] Verify the build command runs `npm run build` in the correct directory
- [ ] Verify Node version pinning (if any) is still correct for Astro's requirements
- [ ] Check any environment variables or build-time secrets still apply

## Local smoke test

- [ ] `npx wrangler pages dev <dist-path>` serves the built site locally
- [ ] `/` renders correctly with full palette
- [ ] Marketing pages render correctly
- [ ] Static assets (favicons, og-image) load with correct MIME types
- [ ] 404 page (if any) behaves correctly

## Production deploy

Defer the production push until TASK-0071 has passed locally.
