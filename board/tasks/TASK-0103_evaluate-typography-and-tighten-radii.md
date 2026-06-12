---
type: task
status: backlog
priority: 3
created: 2026-05-06
parent: EPIC-0020
---

# TASK-0103: Evaluate refined typography and tighten border radii

Two visual decisions deferred since launch and surfaced again in NOTE-0012:

- **Typography**: current body font is workable but generic. Evaluate replacing with a more refined humanist or grotesque sans (Söhne, Untitled Sans, Apercu, Geograph, etc.) that better matches the instrument-grade aesthetic. Keep monospace for data values.
- **Border radius**: current `rounded-xl` on panels and grids reads as too consumer/SaaS. Tighten to ~4–6px to feel sharper and more clinical.

## Acceptance

- Font choice locked or explicitly deferred (with rationale).
- Radius scale reduced project-wide where it touches panels, controls, and the grid.
- Changes preserve readability and visual hierarchy — sharper does not mean harsher.

## Source

- NOTE-0012
