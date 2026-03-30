---
type: resource
status: processed
url: https://codepen.io/oxn-krtv/pen/ExOwLBz
created: 2026-03-26
---

# Original CodePen Prototype

The initial proof-of-concept: a vanilla JS CodePen implementing the parabolic saturation curve as a monochromatic palette generator using chroma.js, noUiSlider, and Tailwind (via CDN).

Chroma Curve is a full React/TypeScript rewrite of this prototype.

## Original Implementation Notes

Three controls:
- **Hue** (0–360): HSL hue angle
- **Saturation** (0–1): base chroma before curve
- **Adjustment** (`sMod`, 25–2500): curve steepness parameter

Core formula (`getSaturation2`):
```js
function getSaturation2(l) {
  const o = 50;
  const p = sMod;
  const v = 1 + (Math.pow(l - o, 2) / p - Math.pow(o, 2) / p) / 100;
  return v;
}
```

Generated colors by stepping through lightness values at a fixed interval, applying `saturation * getSaturation2(lightness)` as the HSL saturation, using chroma.js for color construction.
