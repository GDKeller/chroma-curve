#!/usr/bin/env bash
#
# Generate the full favicon package from source SVG templates.
# Requires: rsvg-convert (librsvg), magick (ImageMagick 7)
#
# Usage: ./app/scripts/generate-favicons.sh [--hue 220]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_DIR="$(cd "$SCRIPT_DIR/../public" && pwd)"
HUE=220

while [[ $# -gt 0 ]]; do
  case "$1" in
    --hue) HUE="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# ---------------------------------------------------------------------------
# Check dependencies
# ---------------------------------------------------------------------------
for cmd in rsvg-convert magick; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "Error: $cmd is required but not found." >&2
    exit 1
  fi
done

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

# ---------------------------------------------------------------------------
# 1. Generate favicon.svg (source of truth for all icon variants)
# ---------------------------------------------------------------------------
cat > "$OUT_DIR/favicon.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="sat" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="hsl(${HUE}, 100%, 50%)"/>
    </linearGradient>
    <linearGradient id="val" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black"/>
    </linearGradient>
    <clipPath id="clip"><rect width="32" height="32"/></clipPath>
    <filter id="shadow"><feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="black" flood-opacity="0.5"/></filter>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="32" height="32" fill="url(#sat)"/>
    <rect width="32" height="32" fill="url(#val)"/>
  </g>
  <rect width="32" height="32" fill="none" stroke="hsl(0,0%,20%)" stroke-width="1.5"/>
  <path d="M24 2 Q-2 16 24 30" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" filter="url(#shadow)"/>
</svg>
SVG

echo "  favicon.svg"

# ---------------------------------------------------------------------------
# 2. Rasterize standard icon sizes
# ---------------------------------------------------------------------------
rsvg-convert -w 48  -h 48  "$OUT_DIR/favicon.svg" -o "$OUT_DIR/favicon-48x48.png"
rsvg-convert -w 192 -h 192 "$OUT_DIR/favicon.svg" -o "$OUT_DIR/icon-192.png"
rsvg-convert -w 512 -h 512 "$OUT_DIR/favicon.svg" -o "$OUT_DIR/icon-512.png"
rsvg-convert -w 180 -h 180 "$OUT_DIR/favicon.svg" -o "$OUT_DIR/apple-touch-icon.png"

echo "  favicon-48x48.png, icon-192.png, icon-512.png, apple-touch-icon.png"

# ---------------------------------------------------------------------------
# 3. Generate .ico (multi-resolution)
# ---------------------------------------------------------------------------
magick "$OUT_DIR/favicon-48x48.png" -define icon:auto-resize=48,32,16 "$OUT_DIR/favicon.ico"

echo "  favicon.ico"

# ---------------------------------------------------------------------------
# 4. Maskable icons (icon centered on #111 background with safe-zone padding)
# ---------------------------------------------------------------------------
rsvg-convert -w 128 -h 128 "$OUT_DIR/favicon.svg" -o "$TMPDIR/icon-128.png"
rsvg-convert -w 384 -h 384 "$OUT_DIR/favicon.svg" -o "$TMPDIR/icon-384.png"

magick -size 192x192 xc:'#111111' "$TMPDIR/icon-128.png" -gravity center -composite "$OUT_DIR/icon-maskable-192.png"
magick -size 512x512 xc:'#111111' "$TMPDIR/icon-384.png" -gravity center -composite "$OUT_DIR/icon-maskable-512.png"

echo "  icon-maskable-192.png, icon-maskable-512.png"

# ---------------------------------------------------------------------------
# 5. OG image (1200x630) — icon card + text + color strip
# ---------------------------------------------------------------------------

# Build a 10-step monochromatic strip (dark → light) for the given hue.
# Saturation peaks in the midtones via a simple parabolic curve.
STRIP_RECTS=""
for i in $(seq 0 9); do
  X=$((i * 120))
  # Lightness: 9% → 90%
  L=$(echo "9 + $i * 9" | bc)
  # Saturation: parabolic curve peaking at mid-lightness
  S=$(echo "scale=1; t=($i - 4.5)/4.5; 60 - 40 * t * t" | bc)
  STRIP_RECTS="${STRIP_RECTS}  <rect x=\"${X}\" y=\"540\" width=\"120\" height=\"90\" fill=\"hsl(${HUE}, ${S}%, ${L}%)\"/>\n"
done

cat > "$TMPDIR/og-image.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="sat" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="hsl(${HUE}, 100%, 50%)"/>
    </linearGradient>
    <linearGradient id="val" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black"/>
    </linearGradient>
    <clipPath id="icon-clip">
      <rect x="80" y="130" width="420" height="320"/>
    </clipPath>
  </defs>

  <rect width="1200" height="630" fill="#111111"/>

  <g clip-path="url(#icon-clip)">
    <rect x="80" y="130" width="420" height="320" fill="url(#sat)"/>
    <rect x="80" y="130" width="420" height="320" fill="url(#val)"/>
  </g>
  <rect x="80" y="130" width="420" height="320" fill="none" stroke="hsl(0,0%,25%)" stroke-width="1.5"/>
  <path d="M420 140 Q120 290 420 440" fill="none" stroke="white" stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round" opacity="0.7"/>

  <text x="580" y="260" font-family="Helvetica Neue, Helvetica, Arial" font-size="56" font-weight="bold" fill="white" letter-spacing="-1">Chroma Curve</text>
  <text x="580" y="310" font-family="Helvetica Neue, Helvetica, Arial" font-size="24" fill="hsl(0,0%,65%)">Monochromatic palette generator</text>
  <text x="580" y="365" font-family="Menlo, Courier New, monospace" font-size="20" fill="hsl(0,0%,45%)">chromacurve.style</text>

$(echo -e "$STRIP_RECTS")
</svg>
SVG

rsvg-convert -w 1200 -h 630 "$TMPDIR/og-image.svg" -o "$OUT_DIR/og-image.png"

echo "  og-image.png"

# ---------------------------------------------------------------------------
echo ""
echo "Done — all assets written to $OUT_DIR"
