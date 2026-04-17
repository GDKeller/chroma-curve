---
type: task
status: backlog
priority: 1
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0060
---

# TASK-0061: Port Tailwind 4 config and `@theme` tokens to Astro

Move the existing Tailwind 4 setup — especially the custom `@theme` block in `app/src/index.css` — into the Astro project. All semantic tokens must be preserved 1:1 so component styles work unchanged after the port.

## Source

`app/src/index.css` contains:

- `@import "tailwindcss"`
- Custom `@theme { ... }` block with:
  - **Type scale**: `text-4xs` (8px) through `text-4xl` (30px)
  - **Text colors**: `text-primary`, `text-secondary`, `text-muted`, `text-faint`
  - **Surfaces**: `surface-base`, `surface-raised`, `surface-overlay`, `surface-hover`, `surface-active`
  - **Borders**: `border-default`, `border-elevated`
  - **Strokes**: `stroke-grid`, `stroke-axis`, `stroke-secondary`, `stroke-primary`
- Any global base styles (body background, font-family declarations)

## Target

- `app-astro/src/styles/global.css` — same `@import "tailwindcss"` plus the same `@theme` block
- Imported from the root layout (TASK-0063) so it applies site-wide

## Verification

- [ ] Running `npm run build` in `app-astro/` generates a CSS bundle containing the custom utility classes (`text-4xs`, `bg-surface-base`, etc.)
- [ ] A smoke-test page rendering `<div class="bg-surface-base text-text-primary text-2xs">` shows the correct background, color, and font size
- [ ] `sr-only` utility class is available (Tailwind ships this by default in v4; verify)
