---
type: task
status: backlog
priority: 2
created: 2026-10-20
parent: EPIC-0012
---

# TASK-0119: Add hover tooltips to control labels

Controls like the saturation mode toggle (`endpoint` / `target`), the range lock, and "adjustment" aren't self-explanatory. Add delayed hover tooltips that explain what each control does without adding permanent UI chrome.

## Scope

- Hue, saturation, adjustment, and range slider labels.
- Mode toggles: saturation mode (`endpoint` / `target`) and the range lock.
- Replace the existing native `title=` strings on these controls (e.g. `SaturationSlider`'s "Slider controls endpoint saturation") with the tooltip, so there is one source of explanatory copy per control.

## Notes

- Radix Tooltip (`@radix-ui/react-tooltip`) isn't installed yet; it matches the existing Radix primitives (dialog, popover, select, slider, tabs).
- NOTE-0023 proposed a ~2s hover delay so tooltips stay out of the way for experienced users. Tune the delay; Radix's `delayDuration` / `skipDelayDuration` cover the "first one slow, subsequent ones instant" pattern.
- Tooltips must also open on keyboard focus, and must not be the only way to learn critical information on touch devices.
- Respect `prefers-reduced-motion` for any enter/exit animation.

## Acceptance

- Every scoped control shows a concise tooltip on hover (after the delay) and on keyboard focus.
- Tooltip styling uses semantic tokens (`surface-overlay`, `border-elevated`, `text-secondary`) — no hardcoded colors.
- No native `title=` duplicates remain on tooltip-equipped controls.

## Related

- TASK-0120 — Rename saturation mode labels. Land it first or together, so the tooltip copy describes the final labels.

## Source

- NOTE-0012 (Add tooltips throughout)
- NOTE-0023 (Helper tooltips on hover)
