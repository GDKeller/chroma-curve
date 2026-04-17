---
type: task
created: 2026-03-16
status: done
epic: EPIC-0002
priority: 2
refs: [UX-5, UX-6]
---

# Fix WCAG AA contrast on functional labels

Functional UI labels across multiple components use opacity values (`text-white/20` to `text-white/40`) that fail WCAG AA 4.5:1 contrast ratio on the dark background (`hsl(0 0% 6%)`).

## Affected locations

- `Header.tsx:12` — `text-white/40` subtitle (~2.5:1)
- `Header.tsx:19` — `text-white/30` copy instruction (~1.9:1)
- `PaletteGrid.tsx:72, 86, 97, 113` — `text-white/20` control labels (~1.4:1)
- `SaturationCurve.tsx:91` — `text-white/20` label (~1.4:1)
- `EffectiveSaturation.tsx:78` — `text-white/20` label (~1.4:1)
- `About.tsx:83, 116` — `text-[hsl(0_0%_50%)]` (~3.5:1)

## Requirements

- Raise all functional labels to at least `text-white/60` (~5.2:1) or find the minimum opacity that achieves 4.5:1 on the dark background
- Decorative/supplementary text can remain lower contrast per WCAG exceptions, but control labels and instructional text must meet AA
- Maintain the subdued aesthetic — use the minimum contrast that meets AA rather than making everything bright
