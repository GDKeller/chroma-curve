import { useMemo } from "react";
import { usePaletteStore } from "../store/paletteStore";
import { generateNeutrals } from "../lib/palette";
import type { ColorEntry } from "../types/palette";

export function usePalette(): ColorEntry[] {
  const hue = usePaletteStore((s) => s.hue);
  const saturation = usePaletteStore((s) => s.saturation);
  const sMod = usePaletteStore((s) => s.sMod);

  return useMemo(
    () => generateNeutrals({ hue, saturation, sMod }),
    [hue, saturation, sMod],
  );
}
