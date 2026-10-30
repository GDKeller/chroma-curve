---
type: task
status: backlog
priority: 2
created: 2026-10-30
parent: EPIC-0014
---

# TASK-0123: Token focus ring on target trigger; fix clear-button hit area and touch visibility

Two problems that predate this task, both in `TargetSwatch/TargetSwatch.tsx`. The review of the TASK-0110/0111 work (commit 3e17daa) found them.

## Trigger focus ring

The swatch trigger button has no focus styles, so it shows Chrome's default `auto` outline, which is blue (rgb(0, 95, 204)).

- When the target is blue, the active-target ring is a similar blue (e.g. rgb(48, 110, 232)). "Focused" and "target active" then look almost the same.
- The outline is chrome that has color, which breaks "colors are the content".
- It draws as a rectangle around both the swatch and the hex label, and the × overlaps its corner.

Fix: put `outline-none` on the button and draw the ring on the round swatch instead: `group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-text-primary`. This matches the canvas and input rings.

## Clear (×) button

- It is 16×16 px, below the 24px minimum (WCAG 2.5.8 and the project rule). It also overlaps the trigger, so the 2.5.8 spacing exception doesn't apply.
- It only becomes visible on hover. In the built CSS, `group-hover:opacity-100` sits inside `@media (hover: hover)`, so touch users never see it. The invisible `opacity-0` button can still be tapped, which leaves a hidden spot on the swatch's corner that silently clears the target.
- Its focus ring (2px outline, 2px offset) is heavy on a 16px circle and cuts into the swatch.

Fix: give it a 24px hit area (`size-6` wrapping the 16px circle), add `pointer-coarse:opacity-100`, and use `outline-offset-1`. Another option is a visible "Clear" text button in the TargetFormats row.

## Acceptance

- Keyboard focus on the trigger shows a neutral, token-based ring around the swatch. No browser-default outline.
- The clear button has a hit area of at least 24px and is visible on touch devices.
- No visual regression for mouse users.

## Source

- Review of commit 3e17daa (2026-10-30): visual UX and a11y reviewers.
