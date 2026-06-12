---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0017
---

# TASK-0078: Lock range slider by default

The lightness range slider should be **locked by default** so the two thumbs move together and preserve the symmetric range as a single value. Users who want asymmetric endpoints can unlock it explicitly.

## Why

Most users want a balanced palette around the midpoint; the symmetric range is the dominant use case. Defaulting unlocked means the first interaction often produces a lopsided range unintentionally, which feels like noise rather than a feature.

## Acceptance

- New sessions start with the range slider locked.
- Lock state continues to persist (existing behavior — verify it still saves to the store).
- Verify the locked default produces an intuitive first-drag experience: dragging either thumb mirrors the other.

## Related

- TASK-0056 (deferred) — lock toggle on hue/saturation sliders. Same lock primitive; check that defaults align across all three.
