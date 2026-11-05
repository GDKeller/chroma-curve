import chroma from "chroma-js";

const WCAG_AA_CONTRAST = 4.5;

export function getContrastColor(bgColor: string): string {
  const whiteContrast = chroma.contrast("white", bgColor);
  return whiteContrast < WCAG_AA_CONTRAST ? "#1d1d1d" : "#ffffff";
}

/** Saturation and lightness precision: one decimal place, in percent (41.86 → 41.9). */
export function roundPercent(percent: number): number {
  return Math.round(percent * 10) / 10;
}

export type ColorFormat = "hex" | "hsl" | "rgb" | "oklch" | "named";

// Hue and saturation tokens of hsl()/hsla(), in either separator syntax
const HSL_TOKENS = /^hsla?\(\s*([^\s,]+)[\s,]+(\d*\.?\d+)%/;

/**
 * Parse a color string and extract hue (0-360), saturation (0-1), and input format.
 * Supports hex, rgb(), hsl(), oklch() (incl. "/ alpha", which is ignored), and
 * named CSS colors.
 */
export function parseTargetColor(
  input: string,
): { hue: number; saturation: number; format: ColorFormat } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    // Detect format before parsing
    const lower = trimmed.toLowerCase();
    let format: ColorFormat = "named";
    if (lower.startsWith("#")) format = "hex";
    else if (lower.startsWith("hsl")) format = "hsl";
    else if (lower.startsWith("rgb")) format = "rgb";
    else if (lower.startsWith("oklch")) format = "oklch";

    // chroma's CSS parser is case-sensitive for function names
    const [hue, sat] = chroma(lower).hsl();
    // chroma rounds hsl() to 8-bit RGB, which shifts low-saturation hues and
    // rounds saturation, so read typed hsl() values directly. parseFloat drops
    // "deg", the only hue unit chroma accepts.
    const typed = HSL_TOKENS.exec(lower);
    const [hueDeg, satPercent] = typed
      ? [parseFloat(typed[1]), Math.min(100, Number(typed[2]))]
      : [hue, sat * 100];
    return {
      // Grays and "none" give NaN, read as 0; typed -140 and 580 wrap to 220
      hue: ((Math.round(hueDeg || 0) % 360) + 360) % 360,
      saturation: roundPercent(satPercent || 0) / 100,
      format,
    };
  } catch {
    return null;
  }
}

/**
 * Format a color at hue/sat/L=50 in the given format.
 */
export function formatTargetColor(
  hue: number,
  saturation: number,
  format: ColorFormat,
): string {
  const color = chroma.hsl(hue, saturation, 0.5);
  switch (format) {
    case "hsl":
      return `hsl(${hue}, ${roundPercent(saturation * 100)}%, 50%)`;
    case "rgb": {
      const [r, g, b] = color.rgb();
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
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

export interface AllFormats {
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
}

/**
 * Return all four string representations of a color at hue/sat/L=50.
 */
export function formatAllFormats(hue: number, saturation: number): AllFormats {
  return {
    hex: formatTargetColor(hue, saturation, "hex"),
    rgb: formatTargetColor(hue, saturation, "rgb"),
    hsl: formatTargetColor(hue, saturation, "hsl"),
    oklch: formatTargetColor(hue, saturation, "oklch"),
  };
}
