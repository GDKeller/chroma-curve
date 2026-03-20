---
type: note
status: inbox
created: 2026-03-20
---

# ΔE scoring to back perception claims

Could ΔE scoring be useful for adding measurable metrics behind the tool's perceptual balance claims?

The core pitch is that the parabolic curve produces "perceptually even" chroma across lightness — ΔE scoring could quantify this by showing that adjacent swatches have consistent perceptual distance, or by comparing curve-corrected vs. fixed-saturation palettes.

## chroma.js API (already a dependency)

chroma.js provides two relevant functions:

### `chroma.deltaE(color1, color2, Kl?, Kc?, Kh?)`
- Uses **CIEDE2000** (not ΔE94 or CIE76) — the most perceptually accurate standard
- Returns 0–100 (0 = identical, 100 = max difference)
- Optional `Kl`, `Kc`, `Kh` parameters adjust lightness/chroma/hue weighting (default 1 each)
- This is the right metric for "do these swatches feel evenly spaced?"

### `chroma.distance(color1, color2, mode?)`
- Euclidean distance in a given color space (default: Lab)
- Simpler/faster but less perceptually accurate than CIEDE2000
- Could be useful for a quick uniformity heuristic

## Potential uses

**In the About dialog (strongest case):**
- Compute ΔE between adjacent swatches for the fixed-saturation strips vs. curve-corrected strips
- Show the standard deviation of adjacent ΔE values — lower = more uniform = the curve is working
- Makes the "why this works" narrative quantifiable rather than just visual

**In the main UI (lighter touch):**
- A small uniformity score or badge on the palette (e.g. "ΔE uniformity: 92%")
- ΔE between adjacent swatches shown on hover or in a detail panel
- Pairs well with NOTE-0002 (contrast checker) — both are "metrics layer" features

**As a comparison tool:**
- Let users toggle between fixed-sat and curve-corrected to see ΔE uniformity improve
- Could generate a mini chart: ΔE per step, flat line = good

**Hue-aware adaptive correction:**
- Some hues are harder to perceive at certain lightness levels (blues in particular lose perceptible chroma faster)
- ΔE scoring could detect when steps are perceptually uneven for a given hue and suggest or auto-adjust lightness step spacing
- This would move beyond a fixed parabolic curve toward a hue-dependent correction — potentially a significant differentiator

**Endpoint distance from black/white:**
- Use ΔE to quantify how far the darkest/lightest palette shades are from pure `#000`/`#fff`
- Useful for users who want to know "how neutral is my near-black?" or "will this lightest shade read as white?"
- Could show as a small metric on the endpoint swatches (e.g. "ΔE from #000: 4.2")

## Considerations

- CIEDE2000 in chroma.js is zero-cost to add (already a dependency, just `chroma.deltaE(a, b)`)
- Risk of over-complicating the UI with numbers most users won't care about
- Strongest value is probably in the About dialog or as an optional detail view, not front-and-center
- The Kl/Kc/Kh weights could theoretically be tuned to emphasize chroma uniformity specifically (set Kl higher to de-weight lightness differences that are intentional)
- Hue-aware correction would be a larger undertaking — would need research into per-hue perceptual curves
