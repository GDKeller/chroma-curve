---
type: task
status: backlog
priority: 2
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0065
---

# TASK-0067: Verify Radix portals work inside React island

Radix Dialog, Popover, and Select use `Portal` components that render into `document.body`. During SSR in an Astro island, portal content is absent from the pre-rendered HTML (expected and correct — dialog content is not crawler-relevant), but must mount correctly post-hydration.

## Checklist

- [ ] Export dialog opens and closes without errors
- [ ] About dialog (after TASK-0059 refactor) opens and closes without errors
- [ ] Target swatch popover opens and positions correctly relative to its trigger
- [ ] Select components (if any) render and are interactive
- [ ] Portal content is attached to `document.body`, not the island container
- [ ] Focus trap behavior works on dialog open
- [ ] Escape key closes portals
- [ ] Outside-click closes popovers

## Expected absences from SSR output

These are correct and not bugs:

- No dialog content in `dist/index.html` (portals are client-only)
- No popover content in `dist/index.html`
- No select listbox content in `dist/index.html`

## Fix strategies (if needed)

- None expected — Radix handles SSR correctly by deferring portals until mount
- If `useLayoutEffect` warnings appear in SSR, use a `useIsomorphicLayoutEffect` shim (`useLayoutEffect` on client, `useEffect` on server)
