---
type: task
status: backlog
priority: 1
created: 2026-04-06
parent: EPIC-0013
---

# TASK-0047: Install vite-react-ssg and update build scripts

Install `vite-react-ssg` as a dev dependency and update npm scripts to use its CLI for production builds.

## Details

`vite-react-ssg` is a CLI wrapper + entry point library, **not** a Vite plugin. No changes to the `plugins` array in `vite.config.ts` are needed. `@vitejs/plugin-react` and `@tailwindcss/vite` remain as-is.

### Steps

1. `npm i -D vite-react-ssg` (latest stable: v0.9.0, supports React 19 + Vite 7)
2. Update `package.json` scripts:
   - `"build": "tsc -b && vite-react-ssg build"` (was `vite build`)
   - `"dev"` and `"preview"` stay unchanged (`vite` / `vite preview`)
3. Optionally add `ssgOptions` to `vite.config.ts` if defaults need overriding:
   ```ts
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     ssgOptions: {
       script: 'async',
       mock: false,
       rootContainerId: 'root',
     },
   })
   ```
   Default values are likely fine — skip unless issues arise.

### Notes

- `react-router-dom` is **not** needed. The single-page mode (`vite-react-ssg/single-page`) works without a router.
- Do not remove `@vitejs/plugin-react` — it is still needed for JSX transform and Fast Refresh in dev.
