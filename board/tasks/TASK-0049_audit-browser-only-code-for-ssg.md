---
type: task
status: backlog
priority: 2
created: 2026-04-06
updated: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0065
---

# TASK-0049: Audit React island hydration for browser-only code

Under Astro with `client:load`, the React island is SSR'd in Node at build time and hydrated in the browser. Any browser API touched during the initial render (not inside `useEffect` or an event handler) will crash the build or cause a hydration mismatch.

## Files to verify

| File | APIs used | Expected status |
|---|---|---|
| `useDynamicFavicon.ts` | `new Image()`, `URL.createObjectURL`, `canvas`, `document.createElement`, `document.head.appendChild` | All inside `useEffect` — safe |
| `useCopyToClipboard.ts` | `navigator.clipboard` | Inside async callback — safe |
| `export.ts` | `document.createElement("a")`, `URL.createObjectURL` | Inside user-triggered function — safe |
| `TargetSwatch.tsx` (and any split files from EPIC-0014) | `canvas.getContext`, `document.addEventListener` | Inside ref callback + `useEffect` — safe |

## Additional concerns

- **Framer Motion**: `MotionConfig reducedMotion="user"` reads `window.matchMedia`. Covered separately by TASK-0066.
- **Radix portals**: `Dialog.Portal` and `Popover.Portal` render into `document.body`. Covered separately by TASK-0067.
- **Zustand store**: pure in-memory store with static defaults — deterministic SSR output.
- **Hydration mismatches**: run `astro build && astro preview` and watch the browser console for "Hydration failed" or "Text content does not match" warnings.

## Escape hatches (if needed)

- Fall back to `client:only="react"` for the palette generator island *(last resort — loses crawler visibility of the default palette)*.
- Split specific subtrees into their own islands with different hydration strategies.
- Add conditional rendering guards behind a hydration-ready flag.

The expectation is that none of these are needed — the existing code is already SSG-safe. This task is a verification pass, not a code-change task.
