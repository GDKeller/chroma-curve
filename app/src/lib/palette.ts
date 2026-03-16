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
  const { hue, saturation, sMod } = params;
  const min = 0.03;
  const max = 1.01;
  const distance = 0.01;

  const entries: ColorEntry[] = [];
  const seen = new Set<number>();
  let value = min;
  let step = 0;

  while (value < max) {
    const i = Math.floor(value * 100);
    if (!seen.has(i)) {
      seen.add(i);
      const sK = getSaturation(i, sMod);
      const color = chroma.hsl(hue, saturation * sK, value);

      const [h, s, l] = color.hsl();
      const hRound = Math.round(h) || 0;
      const sRound = Math.round(s * 10000) / 100;
      const lRound = Math.round(l * 10000) / 100;

      entries.push({
        label: `grey-${i}`,
        lightness: i,
        hsl: [h, s, l],
        hslString: `${hRound}deg ${sRound}% ${lRound}%`,
        hex: color.hex(),
      });
    }

    step++;
    value = step * distance + min;
  }

  return entries.reverse();
}
