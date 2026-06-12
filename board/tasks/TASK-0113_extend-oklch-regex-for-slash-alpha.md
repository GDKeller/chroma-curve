---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0014
---

# TASK-0113: Extend oklch regex to accept slash-alpha syntax

The current OKLCH parser doesn't accept the CSS Color Level 4 slash-alpha syntax: `oklch(70% 0.15 240 / 50%)`. Users pasting modern CSS values get rejected.

## Acceptance

- Regex / parser accepts `L C H` and `L C H / A` forms.
- Alpha is parsed as percentage or 0–1 number.
- Existing well-formed inputs continue to parse identically.
- Parser tests cover slash-alpha cases.

## Source

- NOTE-0030
