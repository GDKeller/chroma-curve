---
type: epic
status: planning
created: 2026-05-06
---

# EPIC-0018: Named scales & swatch labels

Several proposals all assume that swatches gain identity beyond a numeric index — Tailwind-style shade numbers, named-color labels, custom interval positions, and pure-black/white framing anchors. They share a common substrate: a `label` field per swatch, consistent count semantics, and predictable behavior at export. Designing them in isolation will require rework; this EPIC scopes them as a single coherent feature surface.

## Goals

- Decide once: how do swatch labels work, what does count mean when bookends/presets compose, and how do labels flow into export?
- Ship the named-scale features (Tailwind preset, B/W bookends) on top of that decision rather than as one-off hacks.
- Preserve the option to add per-swatch named-color labels (NOTE-0007) without redesign.

## Tasks

- TASK-0087 — Decide label and count semantics for named scales (planning)
- TASK-0088 — Add `label` field to ColorEntry and propagate through pipeline
- TASK-0089 — Add Tailwind 11-shade preset
- TASK-0090 — Reintroduce B/W bookend swatch toggle

## Source NOTEs

- NOTE-0007 — Named swatches
- NOTE-0021 — Custom swatch intervals
- NOTE-0031 — Tailwind 11-swatch preset
- NOTE-0032 — Bring back B/W bookend swatches

## Related

- EPIC-0017 — Control defaults and affordances. TASK-0079 (range endpoint rework) interacts with B/W bookend semantics.
