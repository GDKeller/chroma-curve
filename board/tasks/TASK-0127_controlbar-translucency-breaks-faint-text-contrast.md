---
type: task
status: backlog
priority: 2
created: 2026-10-30
parent: EPIC-0021
---

# TASK-0127: Fix faint-text contrast under the translucent ControlBar

`ControlBar` is `bg-surface-raised/85 backdrop-blur-xl sticky`. With the page scrolled to the top, the bar works out to about #121212, and `text-text-faint` (55%) reaches about 5.5:1. When light palette swatches scroll underneath it, the 15% that shows through brightens the bar.

- Over white swatches (the default `lMax=100` produces them), the bar is about #373737 and `text-faint` drops to **3.53:1**, which fails WCAG 1.4.3.
- Over an L90 gray, it is 3.73:1.

This affects every `text-faint` label in the bar: the slider labels, the TARGET row labels, and "Target (drifted)". This predates this task.

`scripts/contrast-audit.mjs` only checks opaque surfaces, so it misses this case.

## Fix options

- Raise the bar's opacity: `bg-surface-raised/95` brings `text-faint` to about 4.86:1 in the worst case.
- Or use `text-text-muted` for any label that can sit over scrolled content.

## Acceptance

- Every text token used in ControlBar meets AA (4.5:1), even with white swatches directly underneath.
- Optional: teach `contrast-audit.mjs` to model the translucent bar over a white backdrop.

## Source

- Review of commit 3e17daa (2026-10-30): a11y reviewer.
