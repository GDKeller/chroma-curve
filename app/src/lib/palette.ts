import chroma from "chroma-js";
import type { ColorEntry, PaletteParams } from "../types/palette";

/**
 * Parabolic saturation curve centered at lightness 50%.
 * See: https://www.desmos.com/calculator/02ufrfsuzy
 */
export function getSaturation(lightness: number, sMod: number): number {
  // sMod=0 means no curve adjustment — return baseline multiplier of 1.
  // This also prevents division by zero in the formula below.
  if (sMod === 0) return 1;
  const o = 50;
  return 1 + (Math.pow(lightness - o, 2) / sMod - Math.pow(o, 2) / sMod) / 100;
}

export function generateNeutrals(params: PaletteParams): ColorEntry[] {
  const { hue, saturation, sMod, lMin, lMax } = params;

  const entries: ColorEntry[] = [];

  for (let i = lMin; i <= lMax; i++) {
    const l = i / 100;
    const sK = getSaturation(i, sMod);
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
