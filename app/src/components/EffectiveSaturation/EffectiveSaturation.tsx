import { useMemo } from "react";
import { getSaturation } from "../../lib/palette";
import { usePaletteStore } from "../../store/paletteStore";
import type { ColorEntry } from "../../types/palette";
import { LightnessChart } from "../LightnessChart";

interface EffectiveSaturationProps {
  entries: ColorEntry[];
  showDots: boolean;
}

export function EffectiveSaturation({
  entries,
  showDots,
}: EffectiveSaturationProps) {
  const sMod = usePaletteStore((s) => s.sMod);
  const saturation = usePaletteStore((s) => s.saturation);
  const satMode = usePaletteStore((s) => s.satMode);

  const { curvePoints, gridLines, dots } = useMemo(() => {
    const curvePoints = Array.from({ length: 101 }, (_, l) => ({
      lightness: l,
      value: saturation * getSaturation(l, sMod, satMode),
    }));

    // Horizontal grid lines at fixed 10% intervals
    const gridLines = Array.from({ length: 11 }, (_, i) => {
      const v = i * 0.1;
      return { value: v, label: `${i * 10}%` };
    });

    const dots = entries.map((e) => ({
      key: e.lightness,
      lightness: e.lightness,
      value: saturation * getSaturation(e.lightness, sMod, satMode),
      fill: e.hex,
    }));

    return { curvePoints, gridLines, dots };
  }, [sMod, saturation, satMode, entries]);

  return (
    <LightnessChart
      titleId="eff-sat-title"
      title="Effective saturation chart"
      yAxisLabel="Saturation"
      yDomain={[0, 1]}
      gridLines={gridLines}
      baseline={{ value: saturation }}
      curvePoints={curvePoints}
      dots={dots}
      showDots={showDots}
    />
  );
}
