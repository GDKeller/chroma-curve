---
type: task
status: backlog
priority: 3
created: 2026-03-20
parent: EPIC-0008
blocked_by:
  - TASK-0024
tags:
  - oklch-migration
  - deferred
---

# TASK-0031: Rewrite About dialog educational content for OKLCH

`About.tsx` contains an independent HSL implementation: educational strips via `buildStrips`, `ColorPickerPlane`, `CurveGraph`, all using `chroma.hsl()` and `getSaturation()` directly. Its purpose is demonstrating why HSL is perceptually broken.

Post-migration scope:

- Replace HSL-based educational strips with OKLCH equivalents
- Update `ColorPickerPlane` to work in OKLCH
- Update `CurveGraph` to use `chromaCorrection()` instead of `getSaturation()`
- Reframe narrative from "fixing HSL" to "leveraging OKLCH with optional artistic refinement"
- This is a substantial rewrite — do not rush, accuracy matters more than speed
