---
type: task
status: backlog
priority: 2
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0065
---

# TASK-0066: Verify Framer Motion behavior under Astro hydration

Framer Motion v12 supports SSR but has historical edge cases around `window.matchMedia` reads in `MotionConfig` and layout measurements in `AnimatePresence`. Verify none of these cause hydration mismatches or runtime errors under Astro's `client:load` model.

## Checklist

- [ ] `MotionConfig reducedMotion="user"` does not throw during SSR (`astro build` console is clean)
- [ ] `AnimatePresence` mode transitions (dialog open/close) work correctly on the client
- [ ] `motion.div` layout animations fire after hydration, not during SSR
- [ ] `useReducedMotion` hook returns the correct value post-hydration
- [ ] Any `LayoutGroup` usage survives the island boundary
- [ ] Console is clean during `astro build` — no `window is not defined`, no layout warnings
- [ ] `prefers-reduced-motion: reduce` is respected

## Fix strategies (if needed)

- Wrap the `MotionConfig` subtree with a hydration-ready flag (`useEffect` sets state, render conditionally)
- Use Framer Motion's `MotionConfig isStatic` prop during the first render
- Move reduced-motion detection into a `useEffect`-based state setter
- Downgrade the palette generator island from `client:load` to `client:only="react"` *(last resort — loses crawler visibility)*
