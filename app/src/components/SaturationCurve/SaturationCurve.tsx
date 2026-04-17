import { useMemo } from "react";
import { getSaturation } from "../../lib/palette";
import { usePaletteStore } from "../../store/paletteStore";
import type { ColorEntry } from "../../types/palette";
import { LightnessChart } from "../LightnessChart";

interface SaturationCurveProps {
  entries: ColorEntry[];
  showDots: boolean;
}

export function SaturationCurve({ entries, showDots }: SaturationCurveProps) {
  const sMod = usePaletteStore((s) => s.sMod);
  const satMode = usePaletteStore((s) => s.satMode);

  const { curvePoints, yDomain, gridLines, dots } = useMemo(() => {
    const curvePoints = Array.from({ length: 101 }, (_, l) => ({
      lightness: l,
      value: getSaturation(l, sMod, satMode),
    }));

    const allY = curvePoints.map((p) => p.value);
    const yMin = Math.min(...allY, 0);
    const rawMax = Math.max(...allY);
    // Snap to next 0.25 step so the chart fills the plot area cleanly
    const yMax = Math.ceil(rawMax / 0.25) * 0.25;

    // Horizontal grid lines at round values, always including 1.0
    const step = yMax - yMin > 1.5 ? 0.5 : 0.25;
    const gridVals: number[] = [];
    const lo = Math.ceil(yMin / step) * step;
    for (let v = lo; v <= yMax; v += step) {
      gridVals.push(parseFloat(v.toFixed(2)));
    }
    if (!gridVals.includes(1)) gridVals.push(1);
    const gridLines = gridVals
      .sort((a, b) => a - b)
      .map((v) => ({ value: v, label: v.toFixed(2) }));

    const dots = entries.map((e) => ({
      key: e.lightness,
      lightness: e.lightness,
      value: getSaturation(e.lightness, sMod, satMode),
      fill: e.hex,
    }));

    return {
      curvePoints,
      yDomain: [yMin, yMax] as [number, number],
      gridLines,
      dots,
    };
  }, [sMod, satMode, entries]);

  return (
    <LightnessChart
      titleId="sat-curve-title"
      title="Saturation adjustment curve"
      yAxisLabel="Multiplier"
      yDomain={yDomain}
      gridLines={gridLines}
      baseline={{ value: 1 }}
      curvePoints={curvePoints}
      dots={dots}
      showDots={showDots}
    />
  );
}
