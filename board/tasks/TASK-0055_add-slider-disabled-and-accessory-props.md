---
type: task
status: backlog
priority: 3
parent: EPIC-0014
created: 2026-04-06
updated: 2026-10-20
---

# TASK-0055: Add disabled and accessory props to SliderBase

> **Deferred (2026-04-10) — do not pick up.** Only needed to support slider locking (TASK-0056), which is no longer planned. The identity-mismatch confusion EPIC-0014 targets is being solved by clearer in/out display and inline format readouts, not by preventing slider movement. Revisit only if locking comes back into scope.
>
> *Board note (2026-10-20):* moved from the non-spec `deferred` status to `backlog` at priority 3. The deferral still stands; it is recorded here instead of in a custom status.

Add optional `disabled?: boolean` prop (applies opacity-40, pointer-events-none, cursor-not-allowed) and `accessory?: ReactNode` prop (rendered between label and value in header row) to `SliderBase.tsx`. Existing usage unchanged via defaults.

## Files

- `app/src/components/SliderBase/SliderBase.tsx`
