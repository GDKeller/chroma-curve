---
type: task
status: backlog
priority: 1
created: 2026-04-09
parent: EPIC-0013
---

# TASK-0060: Scaffold Astro project alongside `app/`

Create a new Astro project in a sibling directory (suggested: `app-astro/`) so the existing `app/` stays buildable throughout the migration. Swap at the end of the epic: rename `app/` → `app-legacy/`, then `app-astro/` → `app/`, then delete `app-legacy/`.

## Setup steps

1. From project root: `npm create astro@latest app-astro -- --template minimal --typescript strict --no-install --no-git`
2. `cd app-astro && npm install`
3. Add React integration: `npx astro add react`
4. Add Tailwind integration: `npx astro add tailwind` (Astro's Tailwind 4 integration uses `@tailwindcss/vite` under the hood, matching our current setup)
5. Match `app/tsconfig.json` strictness options and any path aliases

## Runtime dependencies

Install in `app-astro/` matching versions from `app/package.json`:

- `react@19`, `react-dom@19`, `@types/react`, `@types/react-dom`
- `chroma-js`, `@types/chroma-js`
- `zustand`
- `framer-motion`
- `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-select`, `@radix-ui/react-slider`, `@radix-ui/react-tabs`
- `@phosphor-icons/react`
- Tailwind pulled in by the integration above

## Scripts

Match `app/package.json` script shape:

- `dev`: `astro dev`
- `build`: `astro check && astro build`
- `preview`: `astro preview`
- `lint`: `eslint .`

Port ESLint + Prettier config from `app/`.

## Not in this task

- Porting any components (TASK-0065)
- Porting Tailwind theme tokens (TASK-0061)
- Root layout, pages, or header nav (TASK-0063, TASK-0064)

## Verification

- [ ] `npm run dev` in `app-astro/` starts the Astro dev server
- [ ] `npm run build` produces a `dist/` directory with the default starter page
- [ ] `npm run lint` runs without errors
- [ ] TypeScript strict mode is enabled and the starter compiles cleanly
