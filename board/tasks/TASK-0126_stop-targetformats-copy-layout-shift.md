---
type: task
status: backlog
priority: 3
created: 2026-10-30
parent: EPIC-0014
---

# TASK-0126: Stop layout shift when copying a value in TargetFormats

Clicking a value in the TARGET formats row (`TargetFormats/TargetFormats.tsx`) replaces it with "Copied". The button shrinks, and every value after it slides left. At 1280px, the RGB button goes from 144px to 77px, and HSL and OKLCH move 67px left. This predates this task.

The values also change length while you drag Hue or Saturation, so the row jitters during a drag.

## Fix options

- Stack "Copied" over the value in a single grid cell (`grid` with both children in `[grid-area:1/1]`) and make the value `invisible` while "Copied" shows. The button then keeps the value's width.
- Fixed-width value cells, sized to the longest string for each format.

## Acceptance

- Copying a value doesn't move any other element in the row.
- Dragging the sliders doesn't reflow the row at lg widths.

## Related

- TASK-0102: Redesign the swatch copy-feedback overlay (the same problem on palette swatches).
- TASK-0121: A mono typeface for color values would fix some of the width jitter.

## Source

- Review of commit 3e17daa (2026-10-30): visual UX reviewer.
