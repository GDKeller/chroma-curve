---
type: reference
created: 2026-03-20
---

# Color Name API

REST API for resolving color values to human-readable names. Given a hex/RGB value, returns the closest named color from a curated dataset of 30,000+ color names.

## Links

- GitHub: https://github.com/meodai/color-name-api
- Live API: https://api.color.pizza

## Relevance to Chroma Curve

Could be used to display descriptive color names on palette swatches (e.g., "Slate Blue", "Dusty Rose") alongside hex/HSL/OKLCH values. Useful for designers who think in color names rather than numeric values. Would be an optional, network-dependent feature — palette generation stays local.

## API Shape

- `GET /v1/?values=hex1,hex2,...` — returns closest named colors for a list of hex values
- Supports batch requests (send all swatch hex values at once)
- Returns: name, exact hex match, closest named hex, distance (ΔE)
