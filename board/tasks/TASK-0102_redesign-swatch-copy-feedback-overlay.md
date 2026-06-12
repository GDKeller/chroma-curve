---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0020
---

# TASK-0102: Redesign swatch copy-feedback overlay

The current "copied" feedback uses a heavy black overlay across the swatch, briefly hiding the color the user just acted on. Replace with a subtler indicator that confirms the action without swallowing the swatch.

## Options

- Inline check + "Copied" label that fades in/out at the swatch corner.
- Brief border pulse using the focus-ring token.
- Animated checkmark icon overlaid in a corner, with no full-bleed cover.

## Acceptance

- Copy feedback is unmistakable but does not obscure the swatch color.
- Animation is fast (≤300ms total) and respects `prefers-reduced-motion`.
- Works alongside TASK-0082 (active copy format highlighting).

## Source

- NOTE-0018
