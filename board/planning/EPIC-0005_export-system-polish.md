---
type: epic
created: 2026-03-16
status: done
---

# Export System Polish

Fix correctness issues and improve robustness of the export system. The GPL format has a float RGB bug, clipboard writes silently fail, color space NaN guards are inconsistent, and the FormatSelector uses incomplete ARIA semantics.

## Scope

- Add clipboard error handling with user feedback (CQ-3, EX-6)
- Fix GPL format float RGB values with Math.round (EX-2)
- Guard HCL/OKLCH chroma channel for NaN consistently (EX-1)
- Polish export output: TW v3 indentation, label prefix coupling, MIME types (EX-3, EX-4, EX-5)
- Replace Tabs with radiogroup pattern in FormatSelector (EX-7)

## Tasks

- TASK-0016
- TASK-0017
- TASK-0018
- TASK-0019
