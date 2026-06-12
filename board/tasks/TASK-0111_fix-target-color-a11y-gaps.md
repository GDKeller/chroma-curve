---
type: task
status: backlog
priority: 1
created: 2026-05-06
parent: EPIC-0014
---

# TASK-0111: Fix target-color a11y gaps

PR #5 review surfaced several accessibility gaps in target-color components.

## Scope

- **`focus-visible`** rings on the clear button, ColorInput, and any other target-color interactive controls.
- **`aria-label`** on icon-only controls (clear button).
- **`aria-live`** region for the TargetFormats display so screen readers announce updates when target changes.

## Acceptance

- Keyboard-only flow through target-color UI is fully visible and announced.
- Axe / Lighthouse a11y audit passes for target-color components.

## Source

- NOTE-0030
