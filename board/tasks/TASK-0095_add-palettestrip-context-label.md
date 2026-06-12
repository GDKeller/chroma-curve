---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0020
---

# TASK-0095: Add context label to PaletteStrip full-scale gradient

The full-scale palette strip above the swatch grid currently sits unlabeled, reading as decoration rather than as the canonical reference gradient it actually is.

## Acceptance

- Strip has a small label or contextual marker (e.g., "FULL SCALE" / step-count badge) communicating its role.
- Treatment uses existing tokens (`text-text-muted` or `text-text-faint`); does not compete with swatches.
- Works alongside TASK-0083's unadjusted reference strip without crowding.

## Source

- NOTE-0010 (#1)
