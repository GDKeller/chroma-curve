---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0020
---

# TASK-0096: Resolve vertical dead space below palette grid in row layout

In row layout, the palette grid leaves significant unused vertical space below it on tall viewports. The empty area reads as a layout bug, not breathing room.

## Options

- Let the grid grow to fill the available height (taller swatches at large viewports).
- Restack the chart panels below the grid into the gap.
- Add metadata content (palette stats, copy hints, contrast badge once EPIC-0019 lands) into the gap.

## Acceptance

- Tall viewports no longer leave a visible empty band below the palette grid in row layout.
- Solution preserves intentional whitespace where it serves the design (don't fill every pixel).

## Source

- NOTE-0010 (#2), NOTE-0011
