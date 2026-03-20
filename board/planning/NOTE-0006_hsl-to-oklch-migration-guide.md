---
type: note
status: inbox
created: 2026-03-20
---

# Chroma Curve — Migration Guide: HSL → OKLCH

## What This Document Is

This is a **pivot guide**, not a from-scratch spec. The tool already exists and works. It generates monochromatic palettes for web/software and graphic designers using a parabolic saturation correction curve in HSL. This document describes how to migrate the internals to OKLCH while preserving the existing UX and controls.

## Current State

### Origin
The tool is based on Pablo Figueiredo's article "The secret to creating neutral color palettes" (https://medium.com/design-bootcamp/the-secret-to-creating-neutral-color-palettes-5e5a650b1718). A commenter created a Desmos visualization of the formula (https://www.desmos.com/calculator/02ufrfsuzy) and a CodePen implementation (https://codepen.io/oxn-krtv/pen/ExOwLBz), which became the basis for this tool.

### How it works today
- All color math happens in **HSL**
- User controls: **Hue** (0–360°), **Saturation** (0–100%), **Adjustment** (the `sMod/p` parameter controlling curve intensity), **Range** (lightness endpoints)
- A parabolic correction curve reduces saturation in the midtones to compensate for HSL's perceptual non-uniformity — without it, midtones appear oversaturated relative to dark/light ends
- The tool displays: a continuous gradient, discrete swatches with HSL labels, a "Saturation Adjustment" chart showing the correction curve, and a "Computed Saturation" chart showing the final saturation values
- Swatch labels show HSL values (e.g., `hsl(220deg 41.4% 14%)`)
- Export functionality exists

### Current formula
```
S(L) = 1 + ((L - 50)² / p - 50² / p) / 100
```
Which simplifies to:
```
S(L) = 1 + L(L - 100) / (100p)
```
Where L is HSL lightness (0–100), p is the adjustment parameter, and S(L) is a multiplier applied to the base HSL saturation. The curve is symmetric around L=50, dips lowest at the midpoint, and returns 1 at both extremes.

## Why Migrate to OKLCH

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
4. **The hue-dependent center shift (new feature, see below) can't work in HSL** — the lookup table is derived from OKLCH gamut data.

## What Changes

### Internal color space: HSL → OKLCH
- All palette generation math moves to OKLCH: hue (H, 0–360°), lightness (L, 0–1), chroma (C, 0–~0.4 for sRGB)
- The correction multiplier applies to **OKLCH chroma (C)** instead of HSL saturation
- HSL/hex/RGB are computed only at the **output stage** for display, swatch labels, and export
- Internal palette state should be stored as OKLCH floats — only quantize to 8-bit RGB at the display/export boundary

### Curve becomes opt-in
- **Default behavior (curve off):** generate palette with flat chroma, clamped to sRGB gamut at each lightness step. This will already look significantly better than uncorrected HSL.
- **When curve is enabled:** apply the parabolic multiplier to chroma, with automatic hue-dependent center shift (new feature).

### New feature: hue-dependent center shift
The current curve is symmetric around L=50. In reality, different hues reach peak chroma at different lightness levels (yellow peaks ~L=88, blue ~L=35). When the curve is active, the center point should auto-adjust based on hue. See implementation below.

## What Does NOT Change

**These are critical for continuity — do not over-engineer these during migration:**

- **UI labels stay designer-friendly.** "Saturation" remains "Saturation" — don't rename it to "Chroma" in the UI. Designers think in saturation. The internal representation changes, the label doesn't.
- **"Adjustment" slider stays.** Same concept, same label. It just operates on OKLCH chroma instead of HSL saturation now.
- **"Saturation Adjustment" chart stays.** Same visualization of the correction curve. Y axis can remain abstract (multiplier) or be labeled "Saturation" — it doesn't need to say "OKLCH Chroma."
- **"Computed Saturation" chart stays.** Same concept — shows the final computed values per step.
- **Swatch layout, gradient preview, export, swatches count, layout options, reverse, labels, borders** — all unchanged.
- **Hue slider** — same 0–360° wheel. OKLCH hue degrees are close to HSL hue degrees; the conversion handles minor differences internally.
- **Range slider** — same concept, maps to OKLCH lightness instead of HSL lightness.

### Swatch labels
Currently show HSL values. Post-migration, consider showing OKLCH as the primary value with hex, or offer a format toggle. But this is a UX decision, not a migration blocker — shipping with HSL labels initially is fine (just convert from internal OKLCH at display time).

## Implementation

### Conversion Functions (TypeScript, zero dependencies)

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

### Hue-Dependent Center Shift (new feature)

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

### Correction Formula (same math, different inputs)

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

### Palette Generation Flow

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

## Migration Checklist

- [ ] Add OKLCH ↔ sRGB conversion functions (or add `culori` dependency)
- [ ] Add `maxChromaInSrgb()` gamut boundary function
- [ ] Refactor palette generation to work in OKLCH internally
- [ ] Map existing "Saturation" slider (0–100%) to OKLCH chroma range (0–~0.4 for sRGB, scaled proportionally)
- [ ] Map existing "Range" slider to OKLCH lightness (0–1)
- [ ] Wire "Adjustment" slider to `chromaCorrection()` operating on OKLCH chroma
- [ ] Add hue-dependent center shift (auto, no UI change needed — the curve just gets smarter)
- [ ] Make curve default to off (p=0) — flat chroma + gamut clamping is the new baseline
- [ ] Keep all existing UI labels ("Saturation", "Adjustment", chart titles) unchanged
- [ ] Update swatch labels to show hex + OKLCH (or add format toggle) — not a blocker, can ship with HSL labels initially
- [ ] Update Desmos visualization link / About dialog if they reference HSL internals
- [ ] Verify palette quality: compare same hue/saturation settings before and after migration to ensure no regressions

## Notes

- The `PEAK_L_BY_HUE` values are approximate. Ideally they'd be derived by scanning the OKLCH gamut boundary (use `maxChromaInSrgb()` at each L step for each hue). Current values are good enough for a first pass.
- ΔE2000 could be used as a quality check to verify perceptual evenness of the final palette steps, but it's not part of the generation algorithm.
- Conversions between color spaces are mathematically lossless at floating point precision. Resolution is only lost at two points: gamut clamping (intentional, unavoidable) and quantization to 8-bit RGB/hex at the output stage (inherent to the format). Store internal palette state as OKLCH floats.
- The tool was originally designed for neutral palettes but works well for monochromatic palettes generally.
