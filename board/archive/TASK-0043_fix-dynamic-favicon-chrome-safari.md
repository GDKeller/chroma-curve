---
type: task
status: done
priority: 3
parent: NOTE-0025
created: 2026-04-01
completed: 2026-04-01
---

# TASK-0043: Fix dynamic favicon in Chrome and Safari

Investigate why the dynamic favicon does not update in Chrome or Safari and implement a fix.

## Resolution

**Chrome: Fixed.** Two issues were resolved:
1. Switched from `blob:` URLs to canvas-rendered PNG data URIs — Chrome doesn't support blob URLs for favicons.
2. Remove all existing `<link rel="icon">` elements before inserting the dynamic one — Chrome was preferring static `.ico`/`.png` links from `index.html`.

**Safari: Graceful degradation.** Safari intentionally ignores DOM mutations to `<link rel="icon">` after initial page load (WebKit design decision, unchanged since 2018, Radar 44268401). No JavaScript workaround exists. Safari users see the static favicon. This matches the approach used by Gmail, Slack, and other apps with dynamic favicons.
