---
type: epic
status: planning
created: 2026-05-06
---

# EPIC-0019: Palette metrics & analysis

Add a measurable, color-science-backed metrics layer to the palette: WCAG contrast checking between selected swatches, and (eventually) ΔE2000 perceptual scoring of the curve's evenness. Both surface trustable numbers next to the swatches rather than bouncing users out to external tools, and both reinforce "show the math."

## Goals

- Provide WCAG AA/AAA contrast checking for any swatch pair without leaving the app.
- Establish a metrics-utility module (built on culori once EPIC-0009 lands) that contrast and ΔE share.
- Decide where ΔE surfaces — About dialog, swatch hover, badge, or adaptive correction — before building anything user-facing for it.

## Tasks

- TASK-0091 — Decide ΔE application surface (planning)
- TASK-0092 — Implement contrast-ratio and ΔE metrics utility
- TASK-0093 — Design swatch-pair selection UX for contrast comparison
- TASK-0094 — Render inline contrast badge for selected pair

## Source NOTEs

- NOTE-0002 — In-context contrast checker
- NOTE-0004 — ΔE perceptual scoring

## Depends on

- EPIC-0009 — culori migration (cleaner ΔE/contrast APIs).
