import type { Key } from "react";
import { W, H, PAD, PLOT_W, PLOT_H, toSvgX, toSvgY } from "./chartConstants";

export interface LightnessChartGridLine {
  value: number;
  label: string;
}

export interface LightnessChartDot {
  key: Key;
  lightness: number;
  value: number;
  fill: string;
}

export interface LightnessChartPoint {
  lightness: number;
  value: number;
}

interface LightnessChartProps {
  titleId: string;
  title: string;
  yAxisLabel: string;
  yDomain: [yMin: number, yMax: number];
  gridLines: LightnessChartGridLine[];
  baseline: { value: number };
  curvePoints: LightnessChartPoint[];
  dots: LightnessChartDot[];
  showDots: boolean;
}

const X_GRID_VALUES = [0, 25, 50, 75, 100];

export function LightnessChart({
  titleId,
  title,
  yAxisLabel,
  yDomain,
  gridLines,
  baseline,
  curvePoints,
  dots,
  showDots,
}: LightnessChartProps) {
  const [yMin, yMax] = yDomain;

  const projectedGridLines = gridLines.map((g) => ({
    ...g,
    y: toSvgY(g.value, yMin, yMax),
  }));

  const verticalGridTop =
    projectedGridLines.length > 0
      ? Math.min(...projectedGridLines.map((g) => g.y))
      : PAD.top;

  const curvePath = curvePoints
    .map((p, i) => {
      const cmd = i === 0 ? "M" : "L";
      return `${cmd}${toSvgX(p.lightness).toFixed(2)},${toSvgY(p.value, yMin, yMax).toFixed(2)}`;
    })
    .join("");

  const baselineY = toSvgY(baseline.value, yMin, yMax);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{title}</title>

        {projectedGridLines.map((g) => (
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

        {X_GRID_VALUES.map((l) => (
          <g key={l}>
            <line
              x1={toSvgX(l)}
              y1={verticalGridTop}
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
          {yAxisLabel}
        </text>

        <line
          x1={PAD.left}
          y1={baselineY}
          x2={W - PAD.right}
          y2={baselineY}
          stroke="var(--color-stroke-axis)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        <path
          d={curvePath}
          fill="none"
          stroke="var(--color-stroke-primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {showDots &&
          dots.map((d) => (
            <circle
              key={d.key}
              cx={toSvgX(d.lightness)}
              cy={toSvgY(d.value, yMin, yMax)}
              r={3}
              fill={d.fill}
              stroke="var(--color-stroke-secondary)"
              strokeWidth={1}
            />
          ))}
      </svg>
    </div>
  );
}
