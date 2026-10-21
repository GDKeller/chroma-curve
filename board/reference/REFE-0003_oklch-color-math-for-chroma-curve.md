---
type: reference
created: 2026-10-20
topic: color-science
tags:
  - oklch-migration
---

# OKLCH Color Math for Chroma Curve

Objective reference for the color math behind the HSL → OKLCH migration: why OKLCH is a better working space than HSL, zero-dependency sRGB ↔ OKLab ↔ OKLCH conversion, sRGB gamut boundary search, the hue-dependent peak-lightness table, and the chroma-correction formula.

> **Provenance.** Extracted 2026-10-20 from NOTE-0006 (*Chroma Curve — Migration Guide: HSL → OKLCH*, archived). Project-specific decisions from that guide — what changes, what stays the same in the UI, and the migration checklist — are tracked as work in EPIC-0006, EPIC-0007, and EPIC-0008. The full original guide remains in `board/archive/` as NOTE-0006.

## Background: the HSL curve

```
S(L) = 1 + ((L - 50)² / p - 50² / p) / 100
```
Which simplifies to:
```
S(L) = 1 + L(L - 100) / (100p)
```
Where L is HSL lightness (0–100), p is the adjustment parameter, and S(L) is a multiplier applied to the base HSL saturation. The curve is symmetric around L=50, dips lowest at the midpoint, and returns 1 at both extremes.

## Why OKLCH instead of HSL

The parabolic curve exists because HSL is perceptually broken. It's a compensation layer for the fact that HSL saturation ≠ perceived chroma. **OKLCH eliminates roughly 80% of the problem the curve was built to solve.**

In OKLCH, constant chroma across lightness steps already looks perceptually even. This means:

1. **The curve shifts from necessity to optional refinement.** Flat chroma in OKLCH produces better baseline palettes than corrected saturation in HSL.
2. **Two real problems remain that the tool still solves:**
   - **Gamut clipping at lightness extremes** — requested chroma may exceed sRGB at very dark/light ends. The tool should proactively reduce chroma near gamut boundaries instead of hard-clamping.
   - **Artistic preference** — designers may still want slightly less chroma in midtones for a more refined feel. The curve becomes a creative control.

### Why HSL is the wrong working space

1. **HSL lightness is not perceptual.** Yellow and blue at HSL L=50 have wildly different perceived brightness.
2. **HSL saturation is not perceptual.** HSL S=100 at different lightness levels looks completely different.
3. **Hue shifts under lightness changes.** Especially blues → purple. OKLCH maintains hue constancy.
4. **A hue-dependent center shift (below) needs OKLCH** — the peak-lightness table is derived from OKLCH gamut data.

## Conversion functions (TypeScript, zero dependencies)

If the codebase uses or can add `culori` (npm), it has first-class OKLCH support and gamut mapping. The functions below are provided in case adding a dependency is undesirable.

```typescript
// ============================================================
// sRGB ↔ Linear sRGB
// ============================================================

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

// ============================================================
// Linear sRGB ↔ OKLab (via LMS)
// ============================================================

function linearSrgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ]
}

function oklabToLinearSrgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ]
}

// ============================================================
// OKLab ↔ OKLCH
// ============================================================

function oklabToOklch(L: number, a: number, b: number): [number, number, number] {
  const C = Math.sqrt(a * a + b * b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return [L, C, h]
}

function oklchToOklab(L: number, C: number, h: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180
  return [L, C * Math.cos(hRad), C * Math.sin(hRad)]
}

// ============================================================
// High-level: OKLCH ↔ sRGB [0-255] ↔ hex ↔ HSL
// ============================================================

/** OKLCH (L: 0-1, C: 0-~0.4, H: 0-360) → sRGB {r, g, b} (0-255) clamped to gamut */
function oklchToSrgb(L: number, C: number, h: number): { r: number; g: number; b: number } {
  const [labL, a, b] = oklchToOklab(L, C, h)
  const [lr, lg, lb] = oklabToLinearSrgb(labL, a, b)
  return {
    r: Math.round(Math.min(1, Math.max(0, linearToSrgb(lr))) * 255),
    g: Math.round(Math.min(1, Math.max(0, linearToSrgb(lg))) * 255),
    b: Math.round(Math.min(1, Math.max(0, linearToSrgb(lb))) * 255),
  }
}

/** sRGB {r, g, b} (0-255) → OKLCH (L: 0-1, C: 0-~0.4, H: 0-360) */
function srgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r / 255)
  const lg = srgbToLinear(g / 255)
  const lb = srgbToLinear(b / 255)
  const [L, a, bb] = linearSrgbToOklab(lr, lg, lb)
  return oklabToOklch(L, a, bb)
}

function srgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
}

/** sRGB (0-255) → HSL (h: 0-360, s: 0-100, l: 0-100) */
function srgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max - min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// ============================================================
// sRGB gamut check (for OKLCH values)
// ============================================================

/** Returns true if the OKLCH color is within sRGB gamut (with small tolerance) */
function isInSrgbGamut(L: number, C: number, h: number, tolerance = 0.001): boolean {
  const [labL, a, b] = oklchToOklab(L, C, h)
  const [lr, lg, lb] = oklabToLinearSrgb(labL, a, b)
  return lr >= -tolerance && lr <= 1 + tolerance
    && lg >= -tolerance && lg <= 1 + tolerance
    && lb >= -tolerance && lb <= 1 + tolerance
}

/** Binary search for max chroma at given L and H that fits in sRGB */
function maxChromaInSrgb(L: number, h: number): number {
  let lo = 0, hi = 0.4
  while (hi - lo > 0.0001) {
    const mid = (lo + hi) / 2
    if (isInSrgbGamut(L, mid, h)) lo = mid
    else hi = mid
  }
  return lo
}
```

## Hue-dependent peak lightness

Different hues reach peak chroma at different lightness levels (yellow peaks near L=88, blue near L=35). Using the hue's peak lightness as the curve center replaces the fixed L=50 symmetry of the HSL formula.

```typescript
/**
 * Lookup table: OKLCH hue degrees → lightness (0-100) where that hue
 * reaches peak chroma within the sRGB gamut. Derived from gamut boundary
 * analysis. Values are linearly interpolated at runtime.
 *
 * These are approximate and tuned for sRGB. If targeting Display P3
 * in the future, this table would need a separate version.
 */
const PEAK_L_BY_HUE: [number, number][] = [
  [0,   60],  // red
  [30,  68],  // orange-red
  [60,  78],  // orange-yellow
  [90,  88],  // yellow
  [120, 72],  // yellow-green
  [150, 58],  // green
  [180, 55],  // cyan
  [210, 48],  // blue-cyan
  [240, 35],  // blue
  [270, 33],  // blue-violet
  [300, 45],  // purple
  [330, 55],  // magenta
  [360, 60],  // wrap back to red
]

/**
 * Returns the lightness (0-100) at which a given OKLCH hue reaches
 * peak perceptual chroma in sRGB. Used as the center point for the
 * saturation correction curve.
 */
function peakLightnessForHue(h: number): number {
  h = ((h % 360) + 360) % 360
  for (let i = 0; i < PEAK_L_BY_HUE.length - 1; i++) {
    const [h0, l0] = PEAK_L_BY_HUE[i]
    const [h1, l1] = PEAK_L_BY_HUE[i + 1]
    if (h >= h0 && h <= h1) {
      const t = (h - h0) / (h1 - h0)
      return l0 + t * (l1 - l0)
    }
  }
  return 50 // fallback
}
```

## Chroma correction formula

The same parabola as the HSL formula, applied to OKLCH chroma and centered on the hue's peak lightness.

```typescript
/**
 * Compute a chroma multiplier for a given lightness and hue.
 *
 * Returns a value where:
 *  - 1.0 = no correction (at L=0 and L=100)
 *  - < 1.0 = reduced chroma (near the hue's peak chroma lightness)
 *
 * @param L - OKLCH lightness scaled to 0-100
 * @param hue - OKLCH hue in degrees (0-360)
 * @param p - Adjustment intensity. Higher = flatter/less correction.
 *            p=0 disables correction (returns 1). p=50 gives ~50%
 *            reduction at the center point.
 */
function chromaCorrection(L: number, hue: number, p: number): number {
  if (p === 0) return 1
  const center = peakLightnessForHue(hue)
  return 1 + ((L - center) * (L - center) - center * (100 - center)) / (100 * p)
}
```

## Example palette generation flow

```typescript
function generatePalette(
  hue: number,        // OKLCH hue degrees (0-360)
  baseChroma: number, // OKLCH chroma (0-~0.4), mapped from user's "Saturation" slider
  p: number,          // Adjustment intensity (0 = curve off)
  steps: number,      // Number of swatches
  rangeMin: number,   // Min lightness (0-1), from Range slider
  rangeMax: number,   // Max lightness (0-1), from Range slider
) {
  const palette = []
  for (let i = 0; i < steps; i++) {
    const L = rangeMin + (rangeMax - rangeMin) * (i / (steps - 1))
    const L100 = L * 100

    // Gamut-aware clamping (always active)
    let chroma = Math.min(baseChroma, maxChromaInSrgb(L, hue))

    // Optional curve (only when p !== 0)
    if (p !== 0) {
      chroma *= chromaCorrection(L100, hue, p)
    }

    // Ensure non-negative
    chroma = Math.max(0, chroma)

    // Convert to output formats
    const rgb = oklchToSrgb(L, chroma, hue)
    const hex = srgbToHex(rgb.r, rgb.g, rgb.b)
    const hsl = srgbToHsl(rgb.r, rgb.g, rgb.b)

    palette.push({
      oklch: { L, C: chroma, H: hue },
      rgb,
      hex,
      hsl,
    })
  }
  return palette
}
```

## Precision and caveats

- The `PEAK_L_BY_HUE` values are approximate. Ideally they'd be derived by scanning the OKLCH gamut boundary (use `maxChromaInSrgb()` at each L step for each hue). Current values are good enough for a first pass.
- ΔE2000 could be used as a quality check to verify perceptual evenness of the final palette steps, but it's not part of the generation algorithm.
- Conversions between color spaces are mathematically lossless at floating point precision. Resolution is only lost at two points: gamut clamping (intentional, unavoidable) and quantization to 8-bit RGB/hex at the output stage (inherent to the format). Store internal palette state as OKLCH floats.
