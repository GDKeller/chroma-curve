---
type: task
status: backlog
priority: 1
created: 2026-04-06
parent: EPIC-0013
blocked_by: TASK-0047
---

# TASK-0049: Audit and guard browser-only code paths for SSG safety

Verify that all browser API usage (`document`, `navigator`, `Image`, `URL.createObjectURL`) is safely inside `useEffect` or event handlers and won't execute during Node-based SSG build. Key files to check:

- `useDynamicFavicon.ts` — canvas rendering, DOM link manipulation
- `useCopyToClipboard.ts` — `navigator.clipboard`
- `export.ts` — anchor element creation for downloads
- `TargetSwatch.tsx` — `document.addEventListener` for drag

Add guards if any code path could fire at build time.
