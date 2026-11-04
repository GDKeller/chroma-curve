---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0020
---

# TASK-0102: Redesign swatch copy-feedback overlay

The current "copied" feedback uses a heavy black overlay across the swatch, briefly hiding the color the user just acted on. Replace with a subtler indicator that confirms the action without swallowing the swatch.

## Current state

`CopyFeedback` (`app/src/components/CopyFeedback/CopyFeedback.tsx`) renders an `absolute inset-0` overlay with `bg-black/50 backdrop-blur-sm`. The overlay covers the swatch labels and shows a lone Phosphor `Check` icon in hardcoded `text-white`. There is no text, so the confirmation is easy to miss. Nothing tells screen readers a copy happened.

## Options

- Inline check + "Copied" label that fades in/out at the swatch corner.
- Brief border pulse using the focus-ring token.
- Animated checkmark icon overlaid in a corner, with no full-bleed cover.

## Acceptance

- Copy feedback is unmistakable but does not obscure the swatch color.
- Animation is fast (≤300ms total) and respects `prefers-reduced-motion`.
- Works alongside TASK-0082 (active copy format highlighting).
- Feedback includes visible "Copied" helper text next to the check icon, not the icon alone. Consider naming the format (e.g. "Copied HEX") so it ties to the active `copyFormat`.
- Swatch labels stay readable during feedback, or the feedback sits where it doesn't cover them.
- Text/icon color comes from `getContrastColor(entry.hex)` (same as the labels), not hardcoded `text-white`.
- The copy is announced to assistive tech via an `aria-live="polite"` region (e.g. "Copied grey-50 #f5f5f5").

## Source

- NOTE-0018
- User request 2026-11-04: clicking a swatch hides the label and shows only a checkmark; needs "copied" helper text.
