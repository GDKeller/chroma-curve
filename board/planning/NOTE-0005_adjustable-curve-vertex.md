---
type: note
status: inbox
created: 2026-03-20
---

# Adjustable curve vertex (center point)

Allow the user to shift the vertex (minimum saturation point) of the parabolic curve away from the fixed L=50 center.

## Current behavior

The formula `S(L) = 1 + ((L - 50)² / p - 50² / p) / 100` is symmetric around L=50. The vertex (lowest saturation multiplier) is always at the midpoint.

## Proposed behavior

- Shifting the vertex (e.g. to L=40) should produce an **asymmetric** curve — steeper on one side, shallower on the other
- **Endpoints should not move** — the saturation at L=0 and L=100 should remain the same regardless of vertex position
- Only the shape between endpoints changes: the minimum saturation point slides left or right

## Implementation thinking

A simple approach: use a **piecewise parabola** — two separate parabolic segments that share the vertex point but have independent curvature. Each segment is anchored at its respective endpoint (L=0 or L=100) and meets at the vertex.

Given vertex at `v` instead of 50:
- For `L < v`: curvature derived from endpoint at L=0 and vertex at L=v
- For `L >= v`: curvature derived from vertex at L=v and endpoint at L=100

This preserves the parabolic character while allowing asymmetry.

## UI considerations

- A slider for vertex position (0–100, default 50) in the controls panel
- Could visualize in the About dialog curve graph — vertex marker shifts along the curve
- Relates to NOTE-0004: hue-aware correction could auto-suggest a vertex shift (e.g. blues might benefit from a vertex below 50)
