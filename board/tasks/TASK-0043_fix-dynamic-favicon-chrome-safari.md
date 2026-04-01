---
type: task
status: backlog
priority: 3
parent: NOTE-0025
created: 2026-04-01
---

# TASK-0043: Fix dynamic favicon in Chrome and Safari

Investigate why the dynamic favicon does not update in Chrome or Safari and implement a fix.

## Observed behavior

- **Firefox/Zen**: Favicon updates dynamically when hue is changed. Works as expected.
- **Chrome**: Static blue favicon persists. Changing hue has no effect on the favicon.
- **Safari**: Same as Chrome — static favicon only, no dynamic updates.

## Possible areas to investigate

- How Chrome/Safari handle dynamic `<link rel="icon">` element updates
- Favicon caching behavior differences across engines
- Data URI size or format limitations
- Whether the existing `<link>` element needs to be replaced vs. mutated
