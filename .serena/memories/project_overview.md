# Chroma Colours Neutrals — Project Overview

## Purpose
A neutral color palette generator that uses a parabolic saturation curve to create natural-feeling neutrals across lightness values. Originally a CodePen (vanilla HTML/JS/CSS), now rebuilt as a modern React/TypeScript app.

## Tech Stack
- **Framework**: React 19 + TypeScript 5.9
- **Build**: Vite 7
- **Styling**: Tailwind CSS 4 (via @tailwindcss/vite plugin)
- **State**: Zustand 5
- **Color manipulation**: chroma-js 3
- **UI primitives**: Radix UI (Dialog, Popover, Slider, Tabs)
- **Animation**: Framer Motion 12
- **Fonts**: Geist Sans + Geist Mono (@fontsource)
- **Linting**: ESLint 9 + typescript-eslint + react-hooks + react-refresh
- **Formatting**: Prettier (semi, double quotes, trailing commas, 90 char width, 2-space tabs)

## Codebase Structure
```
app/                    # Main React application
  src/
    App.tsx             # Root component
    main.tsx            # Entry point
    index.css           # Tailwind imports + theme tokens
    store/
      paletteStore.ts   # Zustand store (hue, saturation, sMod)
    lib/
      colors.ts         # Contrast color utility
      palette.ts        # Core: getSaturation(), generateNeutrals()
      export.ts         # Export functionality
    hooks/
      usePalette.ts     # Palette generation hook
      useCopyToClipboard.ts
    components/
      AppShell.tsx      # Layout shell
      Header.tsx
      About.tsx         # About/info modal
      controls/         # Slider controls (Hue, Saturation, Adjustment)
      palette/          # Color swatches, grid, strip
      curves/           # Saturation curve visualization
      export/           # Export dialog, preview, format selector
    types/
      palette.ts        # Type definitions
src/                    # Legacy vanilla HTML/JS/CSS version
board/                  # Project management board
```

## Key Concept
The core formula (`getSaturation()` in `lib/palette.ts`) adjusts saturation across lightness using a parabolic curve, producing neutrals that feel natural. Desmos reference: https://www.desmos.com/calculator/02ufrfsuzy
