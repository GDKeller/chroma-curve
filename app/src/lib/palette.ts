import chroma from "chroma-js";
import type { ColorEntry, PaletteParams, SatMode } from "../types/palette";

/**
 * Parabolic saturation curve centered at lightness 50%.
 * See: https://www.desmos.com/calculator/02ufrfsuzy
 *
 * In "endpoint" mode the multiplier is 1.0 at L0/L100 (slider = endpoint saturation).
 * In "target" mode the multiplier is 1.0 at L50 (slider = vertex/target saturation).
 */
export function getSaturation(lightness: number, sMod: number, satMode: SatMode): number {
  if (sMod === 0) return 1;
  const o = 50;
  const raw = 1 + (Math.pow(lightness - o, 2) / sMod - Math.pow(o, 2) / sMod) / 100;

  if (satMode === "endpoint") return raw;

  // Normalize so vertex (L50) = 1.0, endpoints > 1.0
  const vertex = 1 - (Math.pow(o, 2) / sMod) / 100;
  if (vertex <= 0) return raw;
  return raw / vertex;
}

export function generateNeutrals(params: PaletteParams): ColorEntry[] {
  const { hue, saturation, sMod, satMode, lMin, lMax } = params;

  const entries: ColorEntry[] = [];

  for (let i = lMin; i <= lMax; i++) {
    const l = i / 100;
    const sK = getSaturation(i, sMod, satMode);
    const color = chroma.hsl(hue, saturation * sK, l);

    const [h, s, lVal] = color.hsl();
    const hRound = Math.round(h) || 0;
    const sRound = Math.round(s * 10000) / 100;
    const lRound = Math.round(lVal * 10000) / 100;

    entries.push({
      label: `grey-${i}`,
      lightness: i,
      hsl: [h, s, lVal],
      hslString: `${hRound}deg ${sRound}% ${lRound}%`,
      hex: color.hex(),
    });
  }

  return entries.reverse();
}
