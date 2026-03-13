import { useMemo } from "react";
import chroma from "chroma-js";
import { getSaturation } from "../../lib/palette";
import { usePaletteStore } from "../../store/paletteStore";
import type { ColorEntry } from "../../types/palette";

interface SaturationCurveProps {
  entries: ColorEntry[];
}

const W = 400;
const H = 400;
const PAD = { top: 24, right: 24, bottom: 36, left: 48 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

export function SaturationCurve({ entries }: SaturationCurveProps) {
  const hue = usePaletteStore((s) => s.hue);
  const sMod = usePaletteStore((s) => s.sMod);
  const saturation = usePaletteStore((s) => s.saturation);

  const { curvePath, yMin, yMax, effectiveDots, gridLines, unadjustedColors, adjustedColors } = useMemo(() => {
    // Sample the curve at every integer lightness
    const points: { x: number; y: number }[] = [];
    for (let l = 0; l <= 100; l++) {
      points.push({ x: l, y: getSaturation(l, sMod) });
    }

    const allY = points.map((p) => p.y);
    const yMin = Math.min(...allY, 0);
    const yMax = Math.max(...allY) * 1.1;

    const toSvgX = (l: number) => PAD.left + (l / 100) * PLOT_W;
    const toSvgY = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * PLOT_H;

    // Build SVG path for the multiplier curve
    const pathParts = points.map((p, i) => {
      const cmd = i === 0 ? "M" : "L";
      return `${cmd}${toSvgX(p.x).toFixed(2)},${toSvgY(p.y).toFixed(2)}`;
    });

    // Dots for each palette entry showing effective saturation
    const effectiveDots = entries.map((e) => {
      const sK = getSaturation(e.lightness, sMod);
      const effective = saturation * sK;
      return {
        cx: toSvgX(e.lightness),
        cy: toSvgY(sK),
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
        y: toSvgY(v),
        label: v.toFixed(2),
      }));

    // Comparison strips: unadjusted (flat sat) vs adjusted (curve-modulated)
    const unadjustedColors = entries.map((e) =>
      chroma.hsl(hue, saturation, e.lightness / 100).hex(),
    );
    const adjustedColors = entries.map((e) => e.hex);

    return { curvePath: pathParts.join(""), yMin, yMax, effectiveDots, gridLines, unadjustedColors, adjustedColors };
  }, [sMod, saturation, hue, entries]);

  // Vertical grid lines at lightness landmarks
  const xGridValues = [0, 25, 50, 75, 100];
  const toSvgX = (l: number) => PAD.left + (l / 100) * PLOT_W;

  return (
    <div className="mx-4 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-white/70 tracking-wide">
          Saturation Adjustment
        </h3>
        <div className="text-[11px] font-mono text-white/40">
          <span className="inline-block w-2 h-2 rounded-full bg-white/50 mr-1 align-middle" />
          palette step
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Saturation curve showing how the saturation multiplier varies across lightness values"
      >
        {/* Grid lines - horizontal */}
        {gridLines.map((g) => (
          <g key={g.label}>
            <line
              x1={PAD.left}
              y1={g.y}
              x2={W - PAD.right}
              y2={g.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={g.y + 3}
              textAnchor="end"
              className="text-[11px] fill-white/30 font-mono"
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
              y1={PAD.top}
              x2={toSvgX(l)}
              y2={H - PAD.bottom}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={toSvgX(l)}
              y={H - PAD.bottom + 16}
              textAnchor="middle"
              className="text-[11px] fill-white/30 font-mono"
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
          className="text-[10px] fill-white/30 font-sans"
        >
          Lightness
        </text>
        <text
          x={12}
          y={PAD.top + PLOT_H / 2}
          textAnchor="middle"
          className="text-[10px] fill-white/30 font-sans"
          transform={`rotate(-90, 12, ${PAD.top + PLOT_H / 2})`}
        >
          Multiplier
        </text>

        {/* 1.0 baseline */}
        <line
          x1={PAD.left}
          y1={PAD.top + (1 - (1 - yMin) / (yMax - yMin)) * PLOT_H}
          x2={W - PAD.right}
          y2={PAD.top + (1 - (1 - yMin) / (yMax - yMin)) * PLOT_H}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Saturation curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Palette entry dots */}
        {effectiveDots.map((d) => (
          <circle
            key={d.lightness}
            cx={d.cx}
            cy={d.cy}
            r={3}
            fill={d.hex}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Comparison strips */}
      <details className="px-4 pb-3">
        <summary className="text-[11px] font-mono text-white/30 cursor-pointer select-none py-2 hover:text-white/50 transition-colors">
          Compare
        </summary>
        <div className="space-y-2 pt-1">
          <div>
            <span className="text-[10px] font-mono text-white/30 block mb-1">Unadjusted</span>
            <div className="h-6 rounded-sm overflow-hidden grid grid-flow-col auto-cols-fr">
              {unadjustedColors.map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono text-white/30 block mb-1">Adjusted</span>
            <div className="h-6 rounded-sm overflow-hidden grid grid-flow-col auto-cols-fr">
              {adjustedColors.map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
