---
type: epic
status: planning
created: 2026-05-06
---

# EPIC-0017: Control defaults and affordances

The curve-shaping controls (hue, saturation, adjustment, lightness range) ship with defaults that don't match the canonical perception-corrected curve, and they offer no clean path back to defaults once the user has tweaked. This makes the *first impression* weaker than it should be (defaults that produce pure black/white endpoints, an unlocked range that drifts asymmetric on the first drag) and the *recovery path* nonexistent (no reset).

## Goals

- First-load state should reflect the canonical perception-corrected curve — the published default — so a user who opens the app and changes nothing already sees the tool's thesis.
- Defaults should bias toward the dominant use case (symmetric range, fully chromatic endpoints), with explicit affordances for the asymmetric/edge cases.
- Reset paths exist, are visible only when the control has been modified, and communicate that the default *is* the canonical curve.

## Tasks

- TASK-0078 — Lock range slider by default
- TASK-0079 — Rework lightness range defaults and endpoint handling
- TASK-0086 — Add reset-to-default for saturation/adjustment/range
- TASK-0107 — Add responsive mobile dock for control bar
- TASK-0108 — Add typed input and stepper buttons for slider values
- TASK-0109 — Add randomize-parameters button

## Source NOTEs

- NOTE-0014 — Mobile controls at bottom
- NOTE-0015 — Explicit control values
- NOTE-0022 — Random button

## Related

- EPIC-0012 — UX discoverability improvements (sibling — discoverability of *what controls do*, vs. this EPIC's focus on *what controls default to and how to recover*).
- NOTE-0032 — Bring back B/W bookend swatches (interacts with TASK-0079's endpoint handling).
- REFE-0001 — Parabolic saturation curve reference (the canonical "default" lives here).
