---
type: task
status: backlog
priority: 2
created: 2026-05-06
updated: 2026-10-20
parent: EPIC-0018
blocked_by:
  - TASK-0087
---

# TASK-0088: Rework ColorEntry label generation per decided semantics

Implement the label data model decided in TASK-0087 on top of the existing `ColorEntry.label` field, and make sure every consumer handles the new shape.

> **Refreshed 2026-10-20.** The original title ("Add `label` field to ColorEntry") assumed the field didn't exist. It does, and has since the React rebuild (3bfeef6): `ColorEntry.label: string` is hard-coded in `lib/palette.ts` as `` `grey-${i}` `` — a leftover from the "Chroma Neutrals" naming. It already flows into swatch rendering (`ColorSwatch` title + visible label) and into every export format as the token name (`--grey-N`, `--color-grey-N`, `$grey-N`, GPL/plain-text names). The work is changing how labels are *generated* and what shape they take, not adding the field.

## Acceptance

- `ColorEntry.label` matches the shape decided in TASK-0087 (e.g. required step label plus an optional human-readable name, if that's the decision).
- `generateNeutrals()` (or its OKLCH replacement) stops hard-coding `grey-${i}` and populates labels from the active preset/feature (step numbers, Tailwind shade names, B/W bookends).
- ColorSwatch renders any new optional label parts when present and gracefully omits them when absent.
- Export token names stay valid CSS custom-property / SCSS identifiers for every label scheme.

## Source

- NOTE-0007, NOTE-0031, NOTE-0032
