---
type: task
status: done
priority: 3
parent: NOTE-0017
created: 2026-04-01
completed: 2026-04-02
---

# TASK-0044: Reduce or remove rounded corners

## Resolution

Removed all border-radius except functional circular elements (slider thumbs/tracks, toggle switches, target swatch circle which use `rounded-full`). All other `rounded-*` classes replaced with `rounded-none` across 10 components. Aligns with the sharp, zero-radius instrument aesthetic.
