---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0017
---

# TASK-0079: Rework lightness range defaults and endpoint handling

The range slider currently defaults to `0–100`, which produces pure black and pure white at the endpoints. This defeats the purpose of the parabolic curve at first glance — the outer swatches lose all chroma and look like raw black/white rather than tinted neutrals.

## Problem

- Default `0–100` makes the first impression a "gray with black/white bookends" palette, undermining the chromatic story the tool is built around.
- The endpoints aren't really useful as palette values — pure #000 and #FFF aren't what most designers want from a monochromatic scale.
- But users *do* sometimes want explicit black/white anchors as separate framing swatches.

## Options to weigh

1. **Default to a tighter range** (e.g., `2–98` or `5–95`) so the first-load palette is fully chromatic.
2. **Cap the slider at `1–99`** so pure black/white aren't reachable through the slider at all.
3. **Bring back the "show B/W" bookend toggle** in the swatch viewer for users who want explicit `#000`/`#FFF` anchors as separate framing swatches outside the chromatic scale (see NOTE-0032 for prior design notes).

The likely answer is a combination — cap the slider somewhere just inside `0/100`, set a more chromatic default, and offer an opt-in B/W toggle for the bookend use case.

## Acceptance

- Decide on default range and slider min/max bounds; document the rationale in the task or a follow-up note.
- First-load palette feels fully chromatic, not "gray with B/W ends."
- If the B/W toggle returns, ensure it composes cleanly with the new range bounds (NOTE-0032 has the design questions).

## Related

- NOTE-0032 (bring back B/W bookend swatches) — the explicit-anchors angle.
- NOTE-0031 (Tailwind 11-swatch preset) — interaction with named-scale presets.
