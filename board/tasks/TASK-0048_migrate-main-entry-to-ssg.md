---
type: task
status: backlog
priority: 1
created: 2026-04-06
parent: EPIC-0013
blocked_by: TASK-0047
---

# TASK-0048: Migrate main.tsx entry point to SSG

Replace `createRoot` in `main.tsx` with the `vite-react-ssg/single-page` entry point. This is the single-page mode — no router needed.

## Migration

**Before:**
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { MotionConfig } from "framer-motion";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
```

**After:**
```tsx
import { ViteReactSSG } from "vite-react-ssg/single-page";
import { StrictMode } from "react";
import "./index.css";
import { MotionConfig } from "framer-motion";
import App from "./App";

export const createRoot = ViteReactSSG(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
```

## Key details

- Import from `vite-react-ssg/single-page`, **not** the main `vite-react-ssg` export (which requires react-router-dom).
- `StrictMode` and `MotionConfig` wrappers stay inline in the JSX passed to `ViteReactSSG()`.
- The function must be a **named export** called `createRoot`.
- `document.getElementById("root")` is removed entirely — the library handles mounting and hydration internally via `hydrateRoot`.
