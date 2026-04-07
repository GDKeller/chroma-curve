---
type: task
status: backlog
priority: 2
epic: EPIC-0014
created: 2026-04-06
---

# TASK-0058: Add inline multi-format color display in ControlBar

New `TargetFormats` component renders beside/below the swatch when `targetInput !== null`. Four rows: hex, rgb, hsl, oklch showing current working color at L50. Click-to-copy each row via `useCopyToClipboard`. Compact styling: `text-3xs` labels, `text-xs` mono values. When drifted, values reflect current hue/sat with subtle stale indicator.

## Files

- `app/src/components/controls/TargetFormats.tsx` (new)
- `app/src/components/controls/ControlBar.tsx`
