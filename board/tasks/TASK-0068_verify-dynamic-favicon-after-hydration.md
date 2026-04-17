---
type: task
status: backlog
priority: 2
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0065
---

# TASK-0068: Verify `useDynamicFavicon` fires after hydration

`useDynamicFavicon` uses `canvas`, `Image`, `URL.createObjectURL`, and `document.head.appendChild` — all browser-only. The hook's work lives in `useEffect`, so it should be naturally safe, but the interaction between Astro's SSR'd static favicon `<link>` tags and the client-side dynamic favicon injection deserves verification.

## Checklist

- [ ] Initial page load shows the static favicon from the layout's `<link>` tags
- [ ] After hydration, the dynamic favicon (reflecting current palette hue) replaces the static one
- [ ] No duplicate `<link rel="icon">` elements accumulate in the `<head>` across re-renders
- [ ] Favicon updates correctly as the user changes hue
- [ ] Browser tab icon reflects the current palette state

## Potential issue

Astro's layout injects favicon `<link>` tags with specific `rel` values (`icon`, `apple-touch-icon`, multiple sizes). If `useDynamicFavicon` appends a new `<link rel="icon">` without removing existing ones, the browser may show stale or stacked icons depending on browser behavior.

## Fix strategies (if needed)

- Update the hook to `querySelectorAll('link[rel="icon"]')` and remove existing entries before appending the dynamic one
- Or: remove the static favicon `<link>` from the Astro layout entirely and let the hook manage it (downside: slower initial favicon paint, briefly shows the default browser icon)
- Or: give the dynamic favicon link a unique `id` and update its `href` in place instead of creating a new element
