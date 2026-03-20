---
type: task
status: backlog
priority: 1
created: 2026-03-20
parent: EPIC-0006
blocked_by:
  - TASK-0020
tags:
  - oklch-migration
---

# TASK-0021: Add memoized gamut boundary lookup

Implement `maxChromaInSrgb(L, h)` binary search and a per-hue memoization layer:

- Precompute 101 values (L=0 to L=100 integer steps) when hue changes
- Cache and reuse across renders — hue slider changes are infrequent relative to saturation/adjustment changes
- Charts should reference the same cached array, not re-derive independently
- Binary search precision: `0.0001` chroma tolerance
