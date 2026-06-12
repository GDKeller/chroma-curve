---
type: note
status: inbox
created: 2026-04-17
---

# Tailwind 11-swatch preset

Add a swatch-count option for **11 swatches** that explicitly maps to Tailwind's shade scale: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`.

## Why

Tailwind 3+ uses 11 shades per color family. Designers building Tailwind-compatible palettes currently have to either count manually or export and relabel. A first-class "11 (Tailwind)" preset makes the tool land directly in the workflow of anyone writing `@theme` config or `tailwind.config.js`.

## Scope

- Swatch count option in the layout/controls alongside existing counts.
- Label: "11 (Tailwind)" or "Tailwind" — keep it short, put the scale hint in a tooltip.
- Swatches rendered in Tailwind's canonical order: `50 → 950` (lightest → darkest).
- Lightness distribution should match Tailwind's non-uniform spacing (50 and 950 are edge cases — 50 is very light, 950 is very dark; the interior steps are roughly linear).
  - Rough Tailwind L values (approx, check reference palettes): 50: 97%, 100: 93%, 200: 86%, 300: 77%, 400: 66%, 500: 55%, 600: 47%, 700: 39%, 800: 31%, 900: 24%, 950: 16%.
  - These aren't evenly spaced — 50 is far from 100, and 950 is far from 900. The parabolic saturation curve needs to still produce balanced output at these lightness values.
- Export should label each swatch with its Tailwind number (`50`, `100`, ... `950`) instead of just an index.

## Open questions

- **Lightness mapping**: Should the preset lock lightness values to Tailwind's exact scale (so palettes always match Tailwind's perceptual spacing), or keep the existing "start/end lightness + equal distribution" and just count to 11? The former is more useful as a preset; the latter is simpler.
- **Naming vs. numbering**: Always show `50/100/.../950` labels in the UI when the preset is active, even outside export? Might be useful for at-a-glance verification.
- **Related to NOTE-0007 (Named swatches)**: a full "named swatches" system could subsume this — the Tailwind preset is one instance of a named scale. Worth considering jointly if that work lands first.
- **Related to NOTE-0021 (Custom swatch intervals)**: custom intervals would let users define arbitrary scales (including Tailwind-like). The 11-swatch Tailwind preset is the curated default that ships with the tool.
- **Export formats**: CSS custom properties should emit `--color-gray-50: #…;` ... `--color-gray-950: #…;` naming automatically when this preset is active.

## References

- Tailwind default color palette: https://tailwindcss.com/docs/colors
- Related notes: NOTE-0007 (Named swatches), NOTE-0021 (Custom swatch intervals), NOTE-0024 (Sync chart step dots with swatch count)
