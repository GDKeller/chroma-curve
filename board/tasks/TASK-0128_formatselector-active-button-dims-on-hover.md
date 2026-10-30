---
type: task
status: backlog
priority: 3
created: 2026-10-30
parent: EPIC-0021
---

# TASK-0128: Stop the FormatSelector active button dimming on hover

In `FormatSelector/FormatSelector.tsx`, `btnBase` includes `text-text-muted hover:text-text-secondary`, and `btnActive` adds `text-text-primary`. Two problems follow:

- **It dims on hover.** The active button still has the base `hover:text-text-secondary`, so hovering it drops the text from 98% to 85% lightness.
- **The active color is fragile.** `text-text-primary` only wins over `text-text-muted` because Tailwind happens to emit `.text-text-primary` later in the CSS. Change the order and the active button silently turns muted.

## Fix

Keep the color classes separate from the shared base:

- the shared base has no text color;
- the inactive state gets `text-text-muted hover:text-text-secondary`;
- the active state gets `text-text-primary`.

Another option is `cn()` (tailwind-merge), if the project adopts it.

## Acceptance

- The active button stays `text-primary` when hovered.
- The active and inactive color classes never appear on the same element.

## Source

- Review of commit 3e17daa (2026-10-30): a11y reviewer.
