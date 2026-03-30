# Chroma Curve

[chromacurve.grantkeller.dev](https://chromacurve.grantkeller.dev)

Monochromatic color palette generator with an adjustable parabolic saturation curve.

Dark and light colors appear less saturated than midtones at the same saturation value. If saturation is raised to correct for this, the midtones can become more saturated than is desired. By applying a parabolic curve to saturation across the lightness range, the visual perception of saturation in dark and light tones can be manipulated without affecting midtones.

This issue often arises when designing a non-grayscale neutral color palette for a UI. Grayscale can be boring and feel flat, and adding a bit of color can give it character or brand cohesion. Too little saturation and the background appears black or white, too much and now elements have obvious hues and the "neutral" perception of the palette is broken.

## The curve formula

A parabolic multiplier scales saturation relative to lightness. It peaks at L50 and tapers toward the endpoints:

```math
multiplier = 1 + (L² / sMod - 50² / sMod) / 100
```

In this implementation, `sMod` controls how aggressively saturation rolls off. Two modes let you anchor the saturation input at either the endpoints (L0/L100) or the midpoint (L50).

## Features

- Hue, saturation, and curve intensity controls with real-time preview
- Adjustable lightness range (constrain to any L-min/L-max window)
- Configurable grid: 8 to 48 swatches, multiple layout orientations
- Click-to-copy any swatch value
- Export in CSS, Tailwind v3/v4, SCSS, JS/TS, JSON, and GPL across HSL, HEX, RGB, HCL, and OKLCH
- Live curve visualization showing saturation distribution

## Credits

Built by [Grant Keller](https://grantkeller.dev)

Concept from [The secret to creating neutral color palettes](https://medium.com/design-bootcamp/the-secret-to-creating-neutral-color-palettes-5e5a650b1718) by [Pablo Figueiredo](https://www.instagram.com/pablofig).  
Formula adapted from [Desmos visualization](https://www.desmos.com/calculator/02ufrfsuzy) by Grant Kiely.
