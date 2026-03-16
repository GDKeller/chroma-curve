---
type: epic
created: 2026-03-16
status: open
---

# Accessibility & ARIA Compliance

Address all high and medium accessibility findings from NOTE-0001. The app currently has several WCAG violations: missing accessible names on interactive controls, no keyboard access on custom widgets, missing landmarks, and Framer Motion animations that ignore `prefers-reduced-motion`.

## Scope

- Extract shared `ToggleSwitch` component with proper ARIA and hit areas (UX-1, UX-2, CQ-6)
- Add keyboard access to hue gradient bar in About modal (UX-3)
- Add visible focus styles to hue preset buttons (UX-4)
- Add semantic landmarks (`<main>`, `<nav>`, `aria-hidden`) across shell components (UX-8, UX-9, UX-14)
- Add `aria-label` / `aria-describedby` to export buttons, dialogs, tab groups, popover trigger (UX-10, UX-12, UX-13, UX-15, UX-16)
- Suppress Framer Motion animations under `prefers-reduced-motion` (UX-11)

## Tasks

- TASK-0001
- TASK-0002
- TASK-0003
- TASK-0004
- TASK-0005
- TASK-0006
