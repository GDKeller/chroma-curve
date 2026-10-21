---
type: task
status: backlog
priority: 1
created: 2026-05-06
updated: 2026-10-20
parent: EPIC-0014
---

# TASK-0111: Fix target-color a11y gaps

PR #5 review surfaced several accessibility gaps in target-color components.

> **Partially resolved — refreshed 2026-10-20.** Commit 7dc1bed (keyboard a11y for the picker) already landed some of the original scope. Verified state below.

## Already done

- ~~**`aria-label`** on icon-only controls~~ — clear button has `aria-label="Clear target color"`.
- Canvas picker has `focus-visible` outline, `role="application"` with keyboard instructions, and a `role="status"` / `aria-live="polite"` readout.

## Remaining scope

- **Clear button focus visibility** — it is `opacity-0` and only revealed by `group-hover:opacity-100`, so keyboard focus lands on an invisible control. Reveal it on focus (`focus-visible:opacity-100` / `group-focus-within:opacity-100`) and add a `focus-visible` ring.
- **ColorInput focus** — currently `outline-none` with only a `focus:border-text-faint` border shift. Replace with a proper `focus-visible` ring that meets 3:1 non-text contrast.
- **`aria-live`** for the TargetFormats display — it has `aria-label="Target color formats"` but no live region, so screen readers aren't told when the target changes or drifts.

## Acceptance

- Keyboard-only flow through target-color UI is fully visible and announced.
- Axe / Lighthouse a11y audit passes for target-color components.

## Source

- NOTE-0030
