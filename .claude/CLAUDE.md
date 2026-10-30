# Chroma Curve

Monochromatic palette generator using a parabolic saturation curve for perceptual balance across lightness. Originally a CodePen (oxn-krtv/ExOwLBz). Live at https://chromacurve.style.

## Commands

Run from the repo root — root scripts proxy into `app/` via `npm run --prefix app`.

```bash
npm run dev            # start Vite in the background, output → logs/dev.log
npm run log            # follow the dev log (log:tail = last 20 lines)
npm run status         # report whether the dev server is running
npm run stop           # kill the dev server
npm run dev:app        # run Vite in the foreground instead
npm run build          # tsc -b && vite build → app/dist
npm run verify         # lint + format + knip + typecheck + test (runs all, fails if any fail)
npm run test           # node:test unit tests (app/src/**/*.test.ts)
npm run verify:fix     # lint:fix + format:fix + knip:fix
npm run verify:strict  # typecheck → lint → knip → format, stops at first failure
npm run deploy         # build + wrangler pages deploy (Cloudflare Pages)
node scripts/contrast-audit.mjs  # WCAG contrast matrix for text × surface tokens (manual)
```

Individual checks: `lint`, `format`, `knip`, `typecheck` (each with a `:fix` variant except `typecheck`), plus `preview`.

The dev port comes from `PORT` in `app/.env.development.local` (default 5173); both `vite.config.ts` and `scripts/config.sh` read it.

## Architecture

React 19 + TypeScript app built with Vite. All app code lives in `app/`.

- `app/src/components/` - one directory per component: `ComponentName/ComponentName.tsx` + an `index.ts` barrel. Named exports only (no default exports); import through the barrel (`../ColorSwatch`).
- `app/src/lib/` - core logic: `palette.ts` (`getSaturation()` curve, `generateNeutrals()`), `colors.ts` (target-color parsing/formatting, contrast helper), `export.ts` (CSS / Tailwind v4 / Tailwind v3 / SCSS / JS / JSON / GPL / text export)
- `app/src/store/paletteStore.ts` - Zustand state: hue, saturation, `sMod` (adjustment), `satMode`, `lMin`/`lMax` (lightness range), `copyFormat`, and target-color fields. Grid view options (layout, swatch count, reverse, labels, borders) are local state in `PaletteGrid`.
- `app/src/types/palette.ts` - shared types (`ColorEntry`, `SatMode`, `ExportFormat`, `ColorSpace`, `CopyFormat`)
- `app/src/hooks/` - `usePalette`, `useCopyToClipboard`, `useDynamicFavicon`
- `scripts/` - dev-server orchestration (`dev`/`log`/`status`/`stop`, shared `config.sh`), `run-all.sh` / `run-sequential.sh` behind the verify scripts, `contrast-audit.mjs`
- `app/scripts/generate-favicons.sh` - regenerates favicon/PWA icon variants in `app/public/`
- Deployment: Cloudflare Pages via Wrangler (`wrangler.jsonc`, output `app/dist`); response headers in `app/public/_headers`

## Tooling

- **ESLint** (`app/eslint.config.js`) - typescript-eslint, react, react-hooks, import, and better-tailwindcss plugins. Size and complexity rules (`max-lines`, `max-lines-per-function`, `max-statements`, `complexity`) carry `goal:` comments marking the target limits.
- **Prettier** (`app/.prettierrc`) with `prettier-plugin-tailwindcss` for class ordering
- **knip** (`app/knip.json`) - unused files, exports, and dependencies

## Key Dependencies

- **chroma.js** - color manipulation and conversion
- **Tailwind CSS 4** - styling (via @tailwindcss/vite)
- **Zustand** - state management
- **Radix UI** - dialog, popover, select, slider, tabs primitives
- **Framer Motion** - animations
- **Phosphor Icons** - iconography

## How It Works

The core formula adjusts saturation across lightness values using a parabolic curve (see `getSaturation()` in `lib/palette.ts`), creating neutrals that feel natural rather than flat. `generateNeutrals()` applies it at each lightness step. `satMode` decides whether the Saturation slider sets the endpoint saturation (`endpoint`) or the L50 saturation (`target`). The Desmos visualization: https://www.desmos.com/calculator/02ufrfsuzy

## Design Tokens

### Type Scale
Custom scale defined in `app/src/index.css` via `@theme`. Use tokens, not hardcoded pixel sizes.

`text-4xs` (8px) / `text-3xs` (9px) / `text-2xs` (10px) / `text-xs` (11px) / `text-sm` (12px) / `text-base` (14px) / `text-lg` (16px) / `text-xl` (18px) / `text-2xl` (21px) / `text-3xl` (24px) / `text-4xl` (30px)

### Color Tokens
All colors use semantic tokens - never hardcode HSL values in components.

- **Text**: `text-primary` (98%) / `text-secondary` (85%) / `text-muted` (72%) / `text-faint` (55%)
- **Surfaces**: `surface-base` (4%) / `surface-raised` (8%) / `surface-overlay` (10%) / `surface-hover` (12%) / `surface-active` (15%) / `surface-active-hover` (20%)
- **Borders**: `border-default` (12%) / `border-elevated` (15%) / `border-strong` (20%) / `border-invalid` (red, input error state)
- **Strokes (SVG/canvas)**: `stroke-grid` (12%) / `stroke-axis` (17%) / `stroke-secondary` (44%) / `stroke-primary` (72%) / `stroke-halo` (black at 40% alpha, for edges drawn over arbitrary palette colors)

## Design Context

### Users
Broad spectrum: UI/product designers building color systems, design engineers who care about perceptual accuracy, front-end developers needing neutral palettes for theming, and color theory enthusiasts drawn to the math. All share a baseline fluency with color - nobody needs hand-holding, but the tool should reward exploration at any depth.

### Use Cases
1. **Monochromatic palettes** - mid-to-high saturation scales that feel cohesive and elegant, not cheap. The parabolic curve prevents the muddy midtones and blown-out extremes that make naive saturation scales look amateurish.
2. **Refined neutrals** - replacing flat grays with hue-tinted neutrals that carry subtle warmth or coolness. Fits into an existing brand system or elevates a neutral-heavy design. The curve ensures visual consistency across the lightness range so the tinting feels intentional, not random.

### Brand Personality
**Precise, minimal, sharp.** The interface is a clinical instrument - it gets out of the way and lets the colors speak. Every pixel exists for a reason.

### Emotional Goals
Confidence & control ("I trust the output"), quiet satisfaction ("every detail is considered"), creative flow ("tweaking until it feels right"), and intellectual curiosity ("I want to understand the curve").

### Aesthetic Direction
- **Theme**: Dark-only. Near-black background. The generated colors are the only chromatic elements (sole exception: the `border-invalid` red on input errors).
- **Typography**: Acumin Pro (body, `font-sans`) + Unbounded (display, `font-display`), loaded via Adobe Fonts/Typekit (project `nbx6xju`). No `--font-mono` token is defined, so `font-mono` resolves to Tailwind's default system monospace stack (the kit serves only Acumin Pro and Unbounded; Recursive Sans Linear Static was dropped). Tight tracking, small type sizes - information-dense without feeling cluttered.
- **Color values**: Use design tokens (`text-text-muted`, `fill-text-faint`, etc.) instead of hardcoded HSL or opacity tricks. Never use `white/60` or `rgba(255,255,255,0.6)` for text - opacity on text blends unpredictably with backgrounds.
- **Surfaces**: Subtle borders and fills. Backdrop blur on sticky elements. Depth through value contrast, not layered opacity.
- **Motion**: Purposeful and restrained. Framer Motion for meaningful transitions (dialogs, layout shifts). CSS for micro-interactions. `prefers-reduced-motion` respected globally via `<MotionConfig reducedMotion="user">` in `main.tsx` plus a CSS override in `index.css`.
- **Icons**: Phosphor Icons, used sparingly alongside text labels for clarity.

### Design Principles
1. **Colors are the content** - the UI is a neutral stage. No decorative gradients, glows, or chrome that competes with the generated palette.
2. **Dense but legible** - pack information tight (small type, compact controls) but maintain clear hierarchy through opacity and weight, not size.
3. **Show the math** - expose the curve, the multipliers, the comparison strips. The technical underpinnings are a feature, not an implementation detail to hide.
4. **Instrument, not toy** - every control should feel precise and responsive. No playful bounces, no consumer-grade rounded-everything aesthetics.
5. **Earn trust through consistency** - uniform spacing scale, predictable control patterns, no surprises. If it looks the same, it works the same.

### Anti-References
- Generic color pickers (Coolors, Adobe Color) - too playful, consumer-grade
- Dashboard/SaaS UI - card-heavy, rounded everything, admin-panel feel
- Academic/research tools - dry, text-heavy, unapproachable
- Overly decorative - gratuitous gradients/glows that distract from actual colors

## Project Board

This project uses a structured board system for project management.

- **Ask before creating new board files** - don't auto-create tasks, ADRs, etc.
- Follow the board system spec for all documentation artifacts
- Use `/board:show` to see current board state
- Use `/board:add` to create new items
- Use `/board:update` after completing significant work to reconcile the board
- Use `/board:check` when starting work to find related board context
