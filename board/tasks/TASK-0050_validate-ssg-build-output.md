---
type: task
status: backlog
priority: 2
created: 2026-04-06
parent: EPIC-0013
blocked_by: TASK-0048,TASK-0049
---

# TASK-0050: Validate build output contains pre-rendered HTML

Run the production build and verify the output `index.html` contains the full rendered palette grid, header, control labels, and swatch values — not just an empty `<div id="root">`. Confirm hydration works correctly in the browser after loading the static HTML.
