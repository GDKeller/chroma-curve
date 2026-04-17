---
type: task
status: backlog
priority: 1
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0060,TASK-0059
---

# TASK-0065: Port React components into palette generator island

Move the entire React component tree from `app/src/` into the Astro project as a single top-level island entry point. Nothing in the tree needs to change structurally — just relocated. TASK-0059 must land first so the About feature is already modularized.

## Entry point

Create `src/components/palette-generator/PaletteGenerator.tsx`:

```tsx
import { StrictMode } from "react";
import { MotionConfig } from "framer-motion";
import App from "../App";

export default function PaletteGenerator() {
  return (
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </StrictMode>
  );
}
```

This replaces `app/src/main.tsx` — the `createRoot` call is gone; Astro handles mounting via the `client:load` directive.

## Directories to move

From `app/src/` to `app-astro/src/`:

- `components/` (all React components including the `about/` feature directory from TASK-0059)
- `hooks/`
- `lib/`
- `store/`
- `types/`

## Import path updates

- None expected if TypeScript path aliases are matched during TASK-0060 scaffolding
- Verify any `@/components/...` or relative imports resolve consistently

## Things that should NOT move

- `main.tsx` — replaced by the `PaletteGenerator` entry above
- `index.html` — replaced by the Astro layout + pages
- `index.css` — `@theme` tokens moved to Astro's `global.css` in TASK-0061
- `vite.config.ts` — Astro owns Vite configuration

## Verification

- [ ] `npm run dev` in `app-astro/` shows the palette generator at `/` with full functionality
- [ ] All existing features work: hue/saturation/lightness controls, export dialog, about dialog, chart tabs, target swatch, dynamic favicon
- [ ] `npm run build` compiles without TypeScript errors
- [ ] `npm run lint` runs without errors
