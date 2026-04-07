---
type: task
status: backlog
priority: 2
epic: EPIC-0014
created: 2026-04-06
---

# TASK-0055: Add disabled and accessory props to SliderBase

Add optional `disabled?: boolean` prop (applies opacity-40, pointer-events-none, cursor-not-allowed) and `accessory?: ReactNode` prop (rendered between label and value in header row) to `SliderBase.tsx`. Existing usage unchanged via defaults.

## Files

- `app/src/components/controls/SliderBase.tsx`
