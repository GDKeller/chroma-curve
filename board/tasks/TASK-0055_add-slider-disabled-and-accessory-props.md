---
type: task
status: deferred
priority: 2
epic: EPIC-0014
created: 2026-04-06
deferred: 2026-04-10
---

# TASK-0055: Add disabled and accessory props to SliderBase

**Deferred** — only needed to support slider locking (TASK-0056), which is no longer planned. The identity-mismatch confusion EPIC-0014 targets is being solved by clearer in/out display and inline format readouts, not by preventing slider movement. Revisit only if locking comes back into scope.

Add optional `disabled?: boolean` prop (applies opacity-40, pointer-events-none, cursor-not-allowed) and `accessory?: ReactNode` prop (rendered between label and value in header row) to `SliderBase.tsx`. Existing usage unchanged via defaults.

## Files

- `app/src/components/controls/SliderBase.tsx`
