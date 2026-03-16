---
type: task
created: 2026-03-16
status: open
epic: EPIC-0001
priority: high
refs: [UX-3]
---

# Add keyboard access to hue gradient bar

The hue gradient bar in `About.tsx` (`HuePicker` component, lines 611–629) responds only to pointer events. Keyboard users cannot interact with it.

## Requirements

- Add `role="slider"` to the gradient `<div>`
- Add `tabIndex={0}` for focusability
- Add `aria-valuemin={0}`, `aria-valuemax={360}`, `aria-valuenow={hue}`, `aria-label="Reference hue"`
- Add `onKeyDown` handler: Left/Down arrow decreases hue, Right/Up increases hue (step of 1, shift+arrow for step of 10)
- Add visible focus style (`focus-visible:ring-2`)

## Files to modify

- `app/src/components/About.tsx` (HuePicker component)
