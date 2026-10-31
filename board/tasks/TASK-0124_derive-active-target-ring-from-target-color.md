---
type: task
status: backlog
priority: 3
created: 2026-10-30
parent: EPIC-0014
---

# TASK-0124: Derive the active-target ring from the actual target color

When a target is active and hasn't drifted, the swatch trigger's ring is `hsl(targetHue, 80%, 55%)` (`TargetSwatch/TargetSwatch.tsx`, `ringColor`). Saturation is fixed at 80%, so a nearly gray target (for example `hsl(220, 5%, 50%)`) gets a vivid blue ring that doesn't represent it.

The code comment calls the ring "content, not chrome". That only holds if the ring actually shows the target color.

## Options

- Use the real target color, `hsl(targetHue, targetSat, 50%)`. Very gray targets would get a ring that barely contrasts with the swatch, so check how that looks.
- Use a neutral `text-primary` ring and treat it as chrome. That is simpler and consistent, but loses the color cue.

## Acceptance

- The ring for a low-saturation target no longer suggests a saturated color.
- Update the comment on `ringColor` to match whichever option is chosen.

## Source

- Review of commit 3e17daa (2026-10-30): visual UX reviewer.
