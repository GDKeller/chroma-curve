import { useMemo } from "react";
import { getSaturation } from "../../lib/palette";
import { usePaletteStore } from "../../store/paletteStore";
import type { ColorEntry } from "../../types/palette";
import { W, H, PAD, PLOT_W, PLOT_H, toSvgX, toSvgY } from "./chartConstants";

interface SaturationCurveProps {
  entries: ColorEntry[];
  showDots: boolean;
}

export function SaturationCurve({ entries, showDots }: SaturationCurveProps) {
  const sMod = usePaletteStore((s) => s.sMod);
  const saturation = usePaletteStore((s) => s.saturation);
  const satMode = usePaletteStore((s) => s.satMode);

  const { curvePath, yMin, yMax, effectiveDots, gridLines, gridTop } =
    useMemo(() => {
      // Sample the curve at every integer lightness
      const points: { x: number; y: number }[] = [];
      for (let l = 0; l <= 100; l++) {
        points.push({ x: l, y: getSaturation(l, sMod, satMode) });
      }

      const allY = points.map((p) => p.y);
      const yMin = Math.min(...allY, 0);
      const rawMax = Math.max(...allY);
      // Snap to next 0.25 step so the chart fills the plot area cleanly
      const yMax = Math.ceil(rawMax / 0.25) * 0.25;

      // Build SVG path for the multiplier curve
      const pathParts = points.map((p, i) => {
        const cmd = i === 0 ? "M" : "L";
        return `${cmd}${toSvgX(p.x).toFixed(2)},${toSvgY(p.y, yMin, yMax).toFixed(2)}`;
      });

      // Dots for each palette entry showing effective saturation
      const effectiveDots = entries.map((e) => {
        const sK = getSaturation(e.lightness, sMod, satMode);
        const effective = saturation * sK;
        return {
          cx: toSvgX(e.lightness),
          cy: toSvgY(sK, yMin, yMax),
          effective: Math.round(effective * 100),
          lightness: e.lightness,
          hex: e.hex,
        };
      });

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
        .map((v) => ({
          y: toSvgY(v, yMin, yMax),
          label: v.toFixed(2),
        }));

      const gridTop =
        gridLines.length > 0 ? Math.min(...gridLines.map((g) => g.y)) : PAD.top;

      return {
        curvePath: pathParts.join(""),
        yMin,
        yMax,
        effectiveDots,
        gridLines,
        gridTop,
      };
    }, [sMod, saturation, satMode, entries]);

  // Vertical grid lines at lightness landmarks
  const xGridValues = [0, 25, 50, 75, 100];

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-labelledby="sat-curve-title"
      >
        <title id="sat-curve-title">Saturation adjustment curve</title>
        {/* Grid lines - horizontal */}
        {gridLines.map((g) => (
          <g key={g.label}>
            <line
              x1={PAD.left}
              y1={g.y}
              x2={W - PAD.right}
              y2={g.y}
              stroke="var(--color-stroke-grid)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={g.y + 3}
              textAnchor="end"
              className="fill-text-faint text-base"
            >
              {g.label}
            </text>
          </g>
        ))}

        {/* Grid lines - vertical */}
        {xGridValues.map((l) => (
          <g key={l}>
            <line
              x1={toSvgX(l)}
              y1={gridTop}
              x2={toSvgX(l)}
              y2={H - PAD.bottom}
              stroke="var(--color-stroke-grid)"
              strokeWidth={1}
            />
            <text
              x={toSvgX(l)}
              y={H - PAD.bottom + 16}
              textAnchor="middle"
              className="fill-text-faint text-base"
            >
              {l}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={PAD.left + PLOT_W / 2}
          y={H - 4}
          textAnchor="middle"
          className="text-2xs fill-text-faint font-sans"
        >
          Lightness
        </text>
        <text
          x={12}
          y={PAD.top + PLOT_H / 2}
          textAnchor="middle"
          className="text-2xs fill-text-faint font-sans"
          transform={`rotate(-90, 12, ${PAD.top + PLOT_H / 2})`}
        >
          Multiplier
        </text>

        {/* 1.0 baseline */}
        <line
          x1={PAD.left}
          y1={toSvgY(1, yMin, yMax)}
          x2={W - PAD.right}
          y2={toSvgY(1, yMin, yMax)}
          stroke="var(--color-stroke-axis)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Saturation curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="var(--color-stroke-primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Palette entry dots */}
        {showDots &&
          effectiveDots.map((d) => (
            <circle
              key={d.lightness}
              cx={d.cx}
              cy={d.cy}
              r={3}
              fill={d.hex}
              stroke="var(--color-stroke-secondary)"
              strokeWidth={1}
            />
          ))}
      </svg>
    </div>
  );
}
