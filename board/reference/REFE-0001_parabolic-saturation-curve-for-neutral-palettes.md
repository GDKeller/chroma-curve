---
type: reference
created: 2026-03-13
---

# Parabolic Saturation Curve for Neutral Palettes

Source: [The secret to creating neutral color palettes](https://medium.com/design-bootcamp/the-secret-to-creating-neutral-color-palettes-5e5a650b1718) by Pablo Figueiredo (Jan 2023)

## Problem

When building a neutral palette with a consistent hue (e.g. blue-tinted greys), using a fixed HSL saturation value produces uneven chromatic intensity across lightness:

- **Low saturation (~20):** Midtones look correct, but light and dark extremes lose nearly all visible chroma — they collapse toward pure grey.
- **High saturation (~40):** Extremes recover their tint, but midtones become visibly over-saturated and break the neutral hierarchy.

No single fixed saturation value produces consistent perceived chroma across the full lightness range. Manual eyeball correction leads to chaotic, irregular values.

## Key Insight

In a saturation/lightness plane (e.g. Figma's color picker), the perceptual boundary between "grey" and "chromatic" is not a straight vertical line — it follows a curve. Colours at the extremes of lightness need more saturation to register as tinted, while midtones need less. This curve is approximately parabolic.

## Solution

Model saturation as a function of lightness using a parabola:

- Vertex at mid-lightness (minimum saturation needed)
- Opens toward both ends (increasing saturation at light and dark extremes)
- For each lightness value, the formula outputs the saturation that maintains consistent perceived chroma

This replaces a single saturation constant with a lightness-dependent curve, producing palettes where tonal progression feels linear and no part of the scale is sacrificed.

## Formula

The article's formula, as implemented in `app/src/lib/palette.ts`:

```
getSaturation(lightness, sMod) = 1 + ((lightness - 50)^2 / sMod - 50^2 / sMod) / 100
```

- `lightness` (0-100): the L value being generated
- `sMod`: controls curve steepness — lower values widen the parabola, increasing the difference between midtone and extreme saturation
- Output is a **multiplier** (not an absolute saturation) applied to the user's base saturation value: `finalSat = baseSaturation * getSaturation(L, sMod)`
- At L=50 (vertex), the multiplier is at its minimum
- At L=0 and L=100 (extremes), the multiplier is at its maximum
- Desmos visualization: https://www.desmos.com/calculator/02ufrfsuzy

## Three User Controls

| Control | Maps to | Effect |
|---------|---------|--------|
| Hue | HSL hue angle | Sets the chromatic identity of the neutral set (e.g. 220 for blue-silver) |
| Saturation | Base chroma before curve | Overall intensity — the curve multiplier scales this |
| Adjustment | `sMod` parameter | Curve steepness — lower = more variation between midtones and extremes |

## Design Context

- The technique is specifically for **tinted neutrals** (not pure achromatic greys) — palettes that carry a subtle hue while remaining functionally neutral.
- Intended for design systems where neutral colours carry brand identity (e.g. blue-silver tones harmonizing with an institutional blue).
- The result is an approximation — perceptually good, not mathematically perfect — but dramatically better than fixed saturation.
- The author positions this as an alternative to pure greyscale, not a replacement.

## Author's Process (for narrative context)

1. Needed tinted neutrals for a design system (blue-silver to match brand blue)
2. Tried fixed HSL saturation — noticed midtones vs extremes imbalance
3. Tried manual eyeball correction — chaotic, unconvincing results
4. Noticed in Figma's color picker that the grey/chromatic boundary follows a curve, not a vertical line
5. Connected the curve shape to a parabola on a saturation/lightness Cartesian plane
6. Built the formula, tested it, compared against fixed — clear improvement in tonal linearity
