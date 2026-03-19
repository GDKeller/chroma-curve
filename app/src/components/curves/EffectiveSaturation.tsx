import { useMemo, useState } from "react";
import { getSaturation } from "../../lib/palette";
import { usePaletteStore } from "../../store/paletteStore";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import type { ColorEntry } from "../../types/palette";
import { W, H, PAD, PLOT_W, PLOT_H, toSvgX, toSvgY } from "./chartConstants";

interface EffectiveSaturationProps {
  entries: ColorEntry[];
}

export function EffectiveSaturation({ entries }: EffectiveSaturationProps) {
  const [showDots, setShowDots] = useState(true);
  const sMod = usePaletteStore((s) => s.sMod);
  const saturation = usePaletteStore((s) => s.saturation);
  const satMode = usePaletteStore((s) => s.satMode);

  const { curvePath, baseLine, dots, gridLines } = useMemo(() => {
    // Sample effective saturation at every integer lightness
    const points: { x: number; y: number }[] = [];
    for (let l = 0; l <= 100; l++) {
      points.push({ x: l, y: saturation * getSaturation(l, sMod, satMode) });
    }

    const yMin = 0;
    const yMax = 1; // fixed 0–100% range

    // Effective saturation curve path
    const pathParts = points.map((p, i) => {
      const cmd = i === 0 ? "M" : "L";
      return `${cmd}${toSvgX(p.x).toFixed(2)},${toSvgY(p.y, yMin, yMax).toFixed(2)}`;
    });

    // Flat baseline at base saturation
    const baseY = toSvgY(saturation, yMin, yMax);
    const baseLine = {
      y: baseY,
      label: `${Math.round(saturation * 100)}%`,
    };

    // Dots at palette entry positions
    const dots = entries.map((e) => {
      const sK = getSaturation(e.lightness, sMod, satMode);
      const effective = saturation * sK;
      return {
        cx: toSvgX(e.lightness),
        cy: toSvgY(effective, yMin, yMax),
        lightness: e.lightness,
        hex: e.hex,
      };
    });

    // Horizontal grid lines at fixed 10% intervals
    const gridLines = Array.from({ length: 11 }, (_, i) => {
      const v = i * 0.1;
      return { y: toSvgY(v, yMin, yMax), label: `${i * 10}%` };
    });

    return { curvePath: pathParts.join(""), baseLine, dots, gridLines };
  }, [sMod, saturation, satMode, entries]);

  const xGridValues = [0, 25, 50, 75, 100];

  return (
    <div className="mx-4 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-white/70 tracking-wide">
          Computed Saturation
        </h3>
        <ToggleSwitch label="steps" checked={showDots} onChange={setShowDots} />
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby="eff-sat-title"
      >
        <title id="eff-sat-title">Effective saturation chart</title>
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
              className="text-[13px] fill-white/30 font-mono"
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
              className="text-[13px] fill-white/30 font-mono"
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
          Saturation
        </text>

        {/* Base saturation line (flat / unadjusted) */}
        <line
          x1={PAD.left}
          y1={baseLine.y}
          x2={W - PAD.right}
          y2={baseLine.y}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Effective saturation curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Palette entry dots */}
        {showDots && dots.map((d) => (
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
    </div>
  );
}
