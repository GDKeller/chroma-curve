# Chroma Curve

Monochromatic palette generator using a parabolic saturation curve for perceptual balance across lightness. Originally a CodePen (oxn-krtv/ExOwLBz).

## Commands

```bash
cd app
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build
npm run lint     # ESLint
```

## Architecture

React 19 + TypeScript app built with Vite. All app code lives in `app/`.

- `app/src/components/` — React components (controls, palette grid, export dialog, about)
- `app/src/lib/` — core logic: `palette.ts` (saturation curve), `colors.ts`, `export.ts`
- `app/src/store/paletteStore.ts` — Zustand state (hue, saturation, lightness range, layout)
- `app/src/hooks/` — `usePalette`, `useCopyToClipboard`
- `src/` / `dist/` — legacy CodePen files (kept for reference)

## Key Dependencies

- **chroma.js** — color manipulation and conversion
- **Tailwind CSS 4** — styling (via @tailwindcss/vite)
- **Zustand** — state management
- **Radix UI** — dialog, popover, slider, tabs primitives
- **Framer Motion** — animations
- **Phosphor Icons** — iconography

## How It Works

The core formula adjusts saturation across lightness values using a parabolic curve (see `getSaturation2()`), creating neutrals that feel natural rather than flat. The Desmos visualization: https://www.desmos.com/calculator/02ufrfsuzy

## Project Board

This project uses a structured board system for project management.

- **Ask before creating new board files** — don't auto-create tasks, ADRs, etc.
- Follow the board system spec for all documentation artifacts
- Use `/board:show` to see current board state
- Use `/board:add` to create new items
- Use `/board:update` after completing significant work to reconcile the board
- Use `/board:check` when starting work to find related board context
