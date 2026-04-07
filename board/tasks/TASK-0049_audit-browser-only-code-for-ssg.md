---
type: task
status: backlog
priority: 1
created: 2026-04-06
parent: EPIC-0013
blocked_by: TASK-0047
---

# TASK-0049: Verify browser-only code is SSG-safe

Confirm that all browser API usage (`document`, `navigator`, `window`, `Image`, `canvas`, `URL.createObjectURL`) is inside `useEffect` or event handlers and will not execute during the Node-based SSG build. **No guards are expected to be needed** — this is a verification pass, not a code change task.

## Files to verify

| File | APIs used | Status |
|---|---|---|
| `useDynamicFavicon.ts` | `new Image()`, `URL.createObjectURL`, `canvas`, `document.createElement`, `document.head.appendChild` | All inside `useEffect` — **safe** |
| `useCopyToClipboard.ts` | `navigator.clipboard` | Inside async callback — **safe** |
| `export.ts` | `document.createElement("a")`, `URL.createObjectURL` | Inside `downloadPalette()`, user-triggered only — **safe** |
| `TargetSwatch.tsx` | `canvas.getContext`, `document.addEventListener` | Inside ref callback + `useEffect` — **safe** |

## Additional checks

- **Framer Motion**: `MotionConfig reducedMotion="user"` reads `window.matchMedia` on the client. Framer Motion v12 has SSR support, but watch for `window is not defined` warnings during `vite-react-ssg build`. If warnings appear, the `<ClientOnly>` component from `vite-react-ssg` can wrap the `MotionConfig`.
- **Radix UI portals**: `Dialog.Portal` and `Popover.Portal` render into `document.body` client-side only — they will be absent from pre-rendered HTML. This is expected and acceptable (dialog/popover content is not crawler-relevant).
- **Zustand store**: Pure in-memory store with static defaults, no `localStorage` or `window` access. SSG renders the deterministic default palette.

## If guards are needed

The library provides `<ClientOnly>` for wrapping components that must not render during SSG:
```tsx
import { ClientOnly } from "vite-react-ssg";
<ClientOnly>{() => <BrowserOnlyComponent />}</ClientOnly>
```

As a fallback, `ssgOptions.mock: true` in `vite.config.ts` mocks browser globals during SSG (avoid unless necessary).
