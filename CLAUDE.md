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

- `app/src/components/` - React components (controls, palette grid, export dialog, about)
- `app/src/lib/` - core logic: `palette.ts` (saturation curve), `colors.ts`, `export.ts`
- `app/src/store/paletteStore.ts` - Zustand state (hue, saturation, lightness range, layout)
- `app/src/hooks/` - `usePalette`, `useCopyToClipboard`, `useDynamicFavicon`

## Key Dependencies

- **chroma.js** - color manipulation and conversion
- **Tailwind CSS 4** - styling (via @tailwindcss/vite)
- **Zustand** - state management
- **Radix UI** - dialog, popover, slider, tabs primitives
- **Framer Motion** - animations
- **Phosphor Icons** - iconography

## How It Works

The core formula adjusts saturation across lightness values using a parabolic curve (see `getSaturation()`), creating neutrals that feel natural rather than flat. The Desmos visualization: https://www.desmos.com/calculator/02ufrfsuzy

## Design Tokens

### Type Scale
Custom scale defined in `app/src/index.css` via `@theme`. Use tokens, not hardcoded pixel sizes.

`text-4xs` (8px) / `text-3xs` (9px) / `text-2xs` (10px) / `text-xs` (11px) / `text-sm` (12px) / `text-base` (14px) / `text-lg` (16px) / `text-xl` (18px) / `text-2xl` (21px) / `text-3xl` (24px) / `text-4xl` (30px)

### Color Tokens
All colors use semantic tokens - never hardcode HSL values in components.

- **Text**: `text-primary` (98%) / `text-secondary` (85%) / `text-muted` (72%) / `text-faint` (50%)
- **Surfaces**: `surface-base` (6%) / `surface-raised` (8%) / `surface-overlay` (10%) / `surface-hover` (12%) / `surface-active` (15%)
- **Borders**: `border-default` (12%) / `border-elevated` (15%)
- **Strokes (SVG)**: `stroke-grid` / `stroke-axis` / `stroke-secondary` / `stroke-primary`

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
- **Theme**: Dark-only. Near-black background. The generated colors are the only chromatic elements.
- **Typography**: Acumin Pro (body) + Unbounded (display) + Recursive Sans Linear Static (mono). Loaded via Adobe Fonts/Typekit (project `nbx6xju`). Tight tracking, small type sizes - information-dense without feeling cluttered.
- **Color values**: Use design tokens (`text-text-muted`, `fill-text-faint`, etc.) instead of hardcoded HSL or opacity tricks. Never use `white/60` or `rgba(255,255,255,0.6)` for text - opacity on text blends unpredictably with backgrounds.
- **Surfaces**: Subtle borders and fills. Backdrop blur on sticky elements. Depth through value contrast, not layered opacity.
- **Motion**: Purposeful and restrained. Framer Motion for meaningful transitions (dialogs, layout shifts). CSS for micro-interactions. `prefers-reduced-motion` respected globally.
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
