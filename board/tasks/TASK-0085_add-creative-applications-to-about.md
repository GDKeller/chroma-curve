---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0016
---

# TASK-0085: Add creative applications section to About dialog

The About dialog explains the curve as a **correction** for a perceptual problem. Add a section past that opening explanation that frames the curve as a **creative instrument** — same mechanism, different intent.

## Why

Users who only see "this fixes a problem" frame the tool as corrective and leave once they have a usable palette. Users who see "this is also a knob you can turn for creative effect" stay, experiment, and produce more interesting outputs. The technical underpinnings are the same — the framing is what shifts.

## Content to cover

- **Tinted neutrals** — the curve's most common creative use: hue-tinted gray scales that feel intentional rather than random. Mention as the "neutral" mode, with example imagery if practical.
- **Vivid monochromatic scales** — the curve makes mid-to-high-saturation monos read cohesively rather than blowing out at the midtones. Differentiate from generic "saturate everything" pickers.
- **Inverted curve (boost mode)** — when TASK-0080 lands, document the polarity flip as a creative tool: vivid mids with muted shadows/highlights, the inverse aesthetic. Until that's built, this is a placeholder; don't ship the mention until the feature exists.
- **Asymmetric ranges** — using the lightness range slider unlocked to bias the palette dark or light gives different aesthetic registers (e.g., shadow-heavy for moody UI, highlight-heavy for soft minimal).

## Tone

Match the existing About dialog: precise, minimal, "show the math" — not marketing copy. Demonstrate the creative use with the same comparison-strip pattern already in the dialog where possible.

## Acceptance

- New section sits below the corrective explanation, clearly labeled as creative/aesthetic territory.
- Section uses the same visual vocabulary (strips, labels) as the rest of the About dialog.
- Copy is concise and information-dense, consistent with the project's design principles.

## Related

- EPIC-0016 (parent).
- TASK-0080 — inverted saturation mode; gates the boost-mode content.
- TASK-0079 — range endpoint rework; relevant to "asymmetric ranges" content.
