import chroma from "chroma-js";

const WCAG_AA_CONTRAST = 4.5;

export function getContrastColor(bgColor: string): string {
  const whiteContrast = chroma.contrast("white", bgColor);
  return whiteContrast < WCAG_AA_CONTRAST ? "#1d1d1d" : "#ffffff";
}

export type ColorFormat = "hex" | "hsl" | "rgb" | "oklch" | "named";

/**
 * Parse a color string and extract hue (0-360), saturation (0-1), and input format.
 * Supports hex, rgb(), hsl(), oklch(), and named CSS colors.
 */
export function parseTargetColor(
  input: string,
): { hue: number; saturation: number; format: ColorFormat } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    // oklch() - chroma.js can't parse this natively
    const oklchMatch = trimmed.match(
      /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)/i,
    );
    if (oklchMatch) {
      let l = parseFloat(oklchMatch[1]);
      if (oklchMatch[1].endsWith("%")) l /= 100;
      const c = parseFloat(oklchMatch[2]);
      const h = parseFloat(oklchMatch[3]);
      const [hue, sat] = chroma.oklch(l, c, h).hsl();
      return {
        hue: Math.round(isNaN(hue) ? 0 : hue),
        saturation: Math.round((isNaN(sat) ? 0 : sat) * 100) / 100,
        format: "oklch",
      };
    }

    // Detect format before parsing
    const lower = trimmed.toLowerCase();
    let format: ColorFormat = "named";
    if (lower.startsWith("#")) format = "hex";
    else if (lower.startsWith("hsl")) format = "hsl";
    else if (lower.startsWith("rgb")) format = "rgb";

    const [hue, sat] = chroma(trimmed).hsl();
    return {
      hue: Math.round(isNaN(hue) ? 0 : hue),
      saturation: Math.round((isNaN(sat) ? 0 : sat) * 100) / 100,
      format,
    };
  } catch {
    return null;
  }
}

/**
 * Format a color at hue/sat/L=50 in the given format.
 */
export function formatTargetColor(hue: number, saturation: number, format: ColorFormat): string {
  const color = chroma.hsl(hue, saturation, 0.5);
  switch (format) {
    case "hsl":
      return `hsl(${hue},${Math.round(saturation * 100)}%,50%)`;
    case "rgb": {
      const [r, g, b] = color.rgb();
      return `rgb(${r},${g},${b})`;
    }
    case "oklch":
      return toOklchString(color.hex());
    default:
      return color.hex();
  }
}

export function toOklchString(hex: string): string {
  const [l, c, h] = chroma(hex).oklch();
  const lR = Math.round(l * 1000) / 1000;
  const cR = Math.round((c || 0) * 1000) / 1000;
  const hR = Math.round(h || 0);
  return `oklch(${lR} ${cR} ${hR})`;
}
