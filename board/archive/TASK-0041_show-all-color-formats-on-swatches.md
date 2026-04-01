---
type: task
status: done
priority: 2
created: 2026-04-01
tags:
  - swatch-display
---

# TASK-0041: Show hex, HSL, and OKLCH values on each swatch

Display all three color format values directly on each swatch: hex, HSL, and OKLCH. Currently swatches only show the HSL value.

## Requirements

- Each swatch should render hex, HSL, and OKLCH values as visible text (not just on hover/tooltip)
- Values should be legible against both light and dark swatch backgrounds (auto contrast)
- Typography should stay dense and compact per the design principles — small mono type, no extra chrome
- Copy-on-click behavior should still work — which format gets copied is determined by a format selector control above the swatch grid (hex, HSL, or OKLCH)

## Format selector

- Add a control above the swatch grid to choose the active copy format: hex, HSL, or OKLCH
- Clicking a swatch copies the value in the selected format
- Persist the selection in the Zustand store so it survives re-renders

## Notes

- This is a display-only change — it does not depend on the OKLCH migration (EPIC-0007). The current palette already has hex available, and OKLCH can be derived from the existing RGB/hex values via chroma.js.
- Related but distinct from TASK-0029, which focuses on updating the copy target and tooltip post-migration. This task is about showing all three formats simultaneously on the swatch face.
