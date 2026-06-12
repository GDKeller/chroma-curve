---
type: task
status: backlog
priority: 1
created: 2026-05-06
parent: EPIC-0014
---

# TASK-0115: Fix opacity-55 contrast degradation in TargetFormats drifted state

When the target is "drifted" (user has moved hue/sat sliders away from the target value), TargetFormats dims its display via `opacity-55`. That blends unpredictably with the surface color and fails contrast in dark mode. This violates the project rule: never use opacity for text dimming — use explicit dim tokens.

## Acceptance

- Drifted state uses an explicit text token (e.g., `text-text-faint`) instead of opacity.
- Drifted readout meets WCAG AA on the project's dark surface.
- Visual hierarchy still distinguishes drifted from active state.

## Source

- NOTE-0030

## Related

- Project convention: no `white/N` opacity-on-text patterns (`feedback_no_opacity_text`).
