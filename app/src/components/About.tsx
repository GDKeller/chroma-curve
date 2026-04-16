import { useCallback, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import chroma from "chroma-js";
import { Info, X } from "@phosphor-icons/react";
import { getSaturation } from "../lib/palette";

const DEFAULT_HUE = 220;
const REF_SMOD = 40;
const STRIP_STEPS = 9;

// Saturation tuned for the midrange - extremes lose chroma
const SAT_FOR_MID = 0.2;
// Saturation tuned for the extremes - midtones are over-saturated
const SAT_FOR_EXTREMES = 0.4;
// Curve-modulated: base sat that produces balanced results
const SAT_CURVED = 0.35;

// Swatch classification for 9 steps (indices 0-8)
// "low" = not intense enough, "ok" = desired, "high" = too intense
type SwatchMark = "low" | "ok" | "high" | null;

// 20% strip: extremes not intense, center too intense, transition zones correct
const markForMid = (i: number): SwatchMark => {
  if (i <= 1 || i >= 7) return "low";
  if (i === 4) return "high";
  return "ok";
};

// 40% strip: extremes correct, midtones too intense
const markForExtremes = (i: number): SwatchMark => {
  if (i <= 1 || i >= 7) return "ok";
  return "high";
};

// Curved: all correct
const markCurved = (): SwatchMark => "ok";

// Lightness step labels
const LIGHTNESS_LABELS = Array.from({ length: STRIP_STEPS }, (_, i) =>
  Math.round(5 + i * (90 / (STRIP_STEPS - 1))),
);

// Scale factor so parabola edges reach 50% sat (perceptual boundary)
const BOUNDARY_SCALE =
  0.5 / getSaturation(LIGHTNESS_LABELS[0], REF_SMOD, "endpoint");

function buildStrips(hue: number) {
  const zero: string[] = [];
  const forMid: string[] = [];
  const forExtremes: string[] = [];
  const boundary: string[] = [];
  const curved: string[] = [];
  for (let i = 0; i < STRIP_STEPS; i++) {
    const lInt = 5 + i * (90 / (STRIP_STEPS - 1)); // L5 through L95
    const l = lInt / 100;
    zero.push(chroma.hsl(hue, 0, l).hex());
    forMid.push(chroma.hsl(hue, SAT_FOR_MID, l).hex());
    forExtremes.push(chroma.hsl(hue, SAT_FOR_EXTREMES, l).hex());
    boundary.push(
      chroma
        .hsl(hue, BOUNDARY_SCALE * getSaturation(lInt, REF_SMOD, "endpoint"), l)
        .hex(),
    );
    curved.push(
      chroma
        .hsl(hue, SAT_CURVED * getSaturation(lInt, REF_SMOD, "endpoint"), l)
        .hex(),
    );
  }
  return { zero, forMid, forExtremes, boundary, curved };
}

interface StripProps {
  colors: string[];
  label?: string;
  mark?: (index: number) => SwatchMark;
}

function Strip({ colors, label, mark }: StripProps) {
  return (
    <div>
      {label && (
        <span className="text-2xs text-text-muted mb-1 block tracking-wider uppercase">
          {label}
        </span>
      )}
      <div
        className="grid overflow-hidden rounded-none"
        style={{ gridTemplateColumns: `repeat(${colors.length}, 1fr)` }}
      >
        {colors.map((c) => (
          <div key={c} className="h-12" style={{ backgroundColor: c }} />
        ))}
      </div>
      {mark && (
        <div
          className="mt-1 grid"
          style={{ gridTemplateColumns: `repeat(${colors.length}, 1fr)` }}
        >
          {colors.map((_, i) => {
            const m = mark(i);
            const text =
              m === "ok"
                ? "ok"
                : m === "high"
                  ? "hi"
                  : m === "low"
                    ? "lo"
                    : null;
            return (
              <div key={`mark-${i}`} className="text-center leading-2">
                {text && (
                  <span
                    className={`text-2xs tracking-wider uppercase ${m === "ok" ? "text-text-secondary" : "text-text-faint"}`}
                  >
                    {text}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LightnessHeader() {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${LIGHTNESS_LABELS.length}, 1fr)` }}
    >
      {LIGHTNESS_LABELS.map((l) => (
        <div
          key={l}
          className="text-text-muted text-center text-xs tracking-wide"
        >
          {l}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Color picker plane - saturation (x) vs lightness (y) with parabolic curve
// ---------------------------------------------------------------------------

function ColorPickerPlane({ hue }: { hue: number }) {
  const size = 200;
  const res = 40; // grid resolution
  const cellSize = size / res;

  const edgeMultiplier = getSaturation(0, REF_SMOD, "endpoint");
  const boundaryScale = 0.5 / edgeMultiplier; // normalize so edges = 50%

  // Build pixel grid
  const cells = useMemo(() => {
    const result: { x: number; y: number; color: string }[] = [];
    for (let row = 0; row < res; row++) {
      for (let col = 0; col < res; col++) {
        const sat = col / (res - 1); // 0→1 left to right
        const light = 1 - row / (res - 1); // 1→0 top to bottom
        result.push({
          x: col * cellSize,
          y: row * cellSize,
          color: chroma.hsl(hue, sat, light).hex(),
        });
      }
    }
    return result;
  }, [hue, cellSize]);

  // Parabolic curve: perceptual boundary scaled so edges reach ~50%
  // Path goes top (l=100) to bottom (l=0) so it draws top→bottom
  const curvePoints = useMemo(() => {
    const points: string[] = [];
    for (let l = 100; l >= 0; l -= 2) {
      const multiplier = getSaturation(l, REF_SMOD, "endpoint");
      const sat = boundaryScale * multiplier;
      const px = sat * size;
      const py = (1 - l / 100) * size;
      points.push(`${l === 100 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return points;
  }, [boundaryScale]);

  // Boundary cells: for each row, find the column on the curve
  // Timeline (12s cycle):
  //   0-2s   bare picker
  //   2-4s   line draws top→bottom
  //   4-5s   line holds
  //   5-6s   line fades out
  //   6-8s   swatches highlight sequentially top→bottom
  //   8-9s   swatches hold
  //   9-10s  swatches fade
  //   10-12s bare picker
  const pause = 1;
  const drawDur = 2;
  const lineHold = 2;
  const lineFade = 1;
  const swatchStart = pause + drawDur + lineHold + lineFade; // 6s
  const swatchDraw = 2;
  const swatchHold = 2;
  const swatchFade = 1;
  const cycle = 12;

  const boundaryCells = useMemo(() => {
    const result: { x: number; y: number; stagger: number }[] = [];
    for (let row = 0; row < res; row++) {
      const light = 1 - row / (res - 1);
      const lInt = Math.round(light * 100);
      const multiplier = getSaturation(lInt, REF_SMOD, "endpoint");
      const sat = boundaryScale * multiplier;
      const col = Math.round(sat * (res - 1));
      if (col >= 0 && col < res) {
        result.push({
          x: col * cellSize,
          y: row * cellSize,
          stagger: (row / res) * swatchDraw, // offset within the swatch phase
        });
      }
    }
    return result;
  }, [boundaryScale, cellSize]);

  return (
    <div className="flex gap-2">
      <span
        className="text-text-faint self-center text-sm tracking-wide"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Lightness
      </span>
      <div className="flex w-full min-w-0 flex-col gap-2">
        <div className="border-border-default overflow-hidden border">
          <svg viewBox={`0 0 ${size} ${size}`} className="block h-auto w-full">
            {cells.map((c, i) => (
              <rect
                key={i}
                x={c.x}
                y={c.y}
                width={cellSize + 0.5}
                height={cellSize + 0.5}
                fill={c.color}
              />
            ))}
            {/* Clip mask for line: wipes top→bottom in, then top→bottom out */}
            <defs>
              <clipPath id="lineReveal">
                <motion.rect
                  x={0}
                  width={size}
                  initial={{ y: 0, height: 0 }}
                  animate={{
                    y: [0, 0, 0, 0, size],
                    height: [0, 0, size, size, 0],
                  }}
                  transition={{
                    duration: cycle,
                    times: [
                      0,
                      pause / cycle, // 2s: start draw
                      (pause + drawDur) / cycle, // 4s: fully revealed
                      (pause + drawDur + lineHold) / cycle, // 5s: start exit
                      (pause + drawDur + lineHold + lineFade) / cycle, // 6s: fully hidden
                    ],
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              </clipPath>
            </defs>
            {/* Dashed curve line */}
            <path
              d={curvePoints.join("")}
              fill="none"
              stroke="white"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.6}
              clipPath="url(#lineReveal)"
            />
            {/* Outline swatches: appear sequentially, then disappear sequentially */}
            {boundaryCells.map((cell, i) => {
              const onTime = (swatchStart + cell.stagger) / cycle;
              const onEnd = Math.min(onTime + 0.01, 1);
              const offStart =
                (swatchStart +
                  swatchDraw +
                  swatchHold +
                  cell.stagger * (swatchFade / swatchDraw)) /
                cycle;
              const offEnd = Math.min(offStart + 0.01, 1);
              return (
                <motion.rect
                  key={`b-${i}`}
                  x={cell.x}
                  y={cell.y}
                  width={cellSize}
                  height={cellSize}
                  fill="none"
                  stroke="white"
                  strokeWidth={0.5}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0, 0.35, 0.35, 0, 0],
                  }}
                  transition={{
                    duration: cycle,
                    times: [0, onTime, onEnd, offStart, offEnd, 1],
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              );
            })}
          </svg>
        </div>
        <span className="text-text-faint text-center text-sm tracking-wide">
          Saturation
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Curve graph + rotated picker alignment (square, side-by-side)
// ---------------------------------------------------------------------------

function VisualPanel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex gap-2">
      <span
        className="text-text-muted shrink-0 self-center text-sm tracking-wide"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {label}
      </span>
      <div className="w-full">{children}</div>
    </div>
  );
}

const CURVE_SIZE = 200;
const CURVE_RES = 40;
const CURVE_CELL = CURVE_SIZE / CURVE_RES;
const SAT_GRID_LINES = [0.1, 0.2, 0.3, 0.4, 0.5];
const CURVE_EDGE_MULT = getSaturation(0, REF_SMOD, "endpoint");
const CURVE_BSCALE = 0.5 / CURVE_EDGE_MULT;

function curveToX(l: number) {
  return (l / 100) * CURVE_SIZE;
}
function curveToY(sat: number) {
  return (1 - sat) * CURVE_SIZE;
}

function useCurvePickerData(hue: number) {
  return useMemo(() => {
    const curveData: { l: number; sat: number }[] = [];
    for (let l = 0; l <= 100; l += 2) {
      curveData.push({
        l,
        sat: CURVE_BSCALE * getSaturation(l, REF_SMOD, "endpoint"),
      });
    }

    const curvePath = curveData
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${curveToX(p.l).toFixed(1)},${curveToY(p.sat).toFixed(1)}`,
      )
      .join("");

    const fillPath = `${curvePath} L${CURVE_SIZE},${CURVE_SIZE} L0,${CURVE_SIZE} Z`;

    const pickerCells: { x: number; y: number; color: string }[] = [];
    for (let row = 0; row < CURVE_RES; row++) {
      for (let col = 0; col < CURVE_RES; col++) {
        const light = col / (CURVE_RES - 1);
        const sat = 1 - row / (CURVE_RES - 1);
        pickerCells.push({
          x: col * CURVE_CELL,
          y: row * CURVE_CELL,
          color: chroma.hsl(hue, sat, light).hex(),
        });
      }
    }

    return { curveData, curvePath, fillPath, pickerCells };
  }, [hue]);
}

function CurveGraph({
  curvePath,
  fillPath,
  curveData,
}: {
  curvePath: string;
  fillPath: string;
  curveData: { l: number; sat: number }[];
}) {
  return (
    <VisualPanel label="S(L)">
      <svg
        viewBox={`0 0 ${CURVE_SIZE} ${CURVE_SIZE}`}
        className="border-border-default bg-surface-raised block h-auto w-full border"
      >
        {SAT_GRID_LINES.map((s) => (
          <line
            key={`h-${s}`}
            x1={0}
            y1={curveToY(s)}
            x2={CURVE_SIZE}
            y2={curveToY(s)}
            stroke="white"
            strokeOpacity={0.04}
            strokeWidth={0.5}
          />
        ))}
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((l) => (
          <line
            key={`v-${l}`}
            x1={curveToX(l)}
            y1={0}
            x2={curveToX(l)}
            y2={CURVE_SIZE}
            stroke="white"
            strokeOpacity={0.04}
            strokeWidth={0.5}
          />
        ))}
        <path d={fillPath} fill="url(#alignFill)" />
        <defs>
          <linearGradient id="alignFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity={0.1} />
            <stop offset="100%" stopColor="white" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <path
          d={curvePath}
          fill="none"
          stroke="var(--color-stroke-primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x={curveToX(50)}
          y={curveToY(curveData[25].sat) + 12}
          textAnchor="middle"
          className="text-2xs fill-text-faint"
        >
          min
        </text>
      </svg>
      <div className="text-text-muted mt-1 flex justify-between text-sm tracking-wide">
        <span>0</span>
        <span>L</span>
        <span>100</span>
      </div>
    </VisualPanel>
  );
}

function RotatedPicker({
  pickerCells,
  curvePath,
}: {
  pickerCells: { x: number; y: number; color: string }[];
  curvePath: string;
}) {
  return (
    <VisualPanel label="Saturation">
      <svg
        viewBox={`0 0 ${CURVE_SIZE} ${CURVE_SIZE}`}
        className="border-border-default block h-auto w-full overflow-hidden border"
      >
        {pickerCells.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={CURVE_CELL + 0.5}
            height={CURVE_CELL + 0.5}
            fill={c.color}
          />
        ))}
        <path
          d={curvePath}
          fill="none"
          stroke="white"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={0.5}
        />
      </svg>
      <div className="mt-1 text-center">
        <span className="text-text-muted text-sm tracking-wide">Lightness</span>
      </div>
    </VisualPanel>
  );
}

function Formula() {
  return (
    <div className="border-border-default bg-surface-raised text-text-muted flex flex-col flex-wrap gap-4 border px-4 py-4 font-mono text-lg">
      <div>
        <span className="text-text-secondary">S</span>(L) = 1 + ((L - 50)
        <sup>2</sup> / <span className="text-text-muted">p</span> - 50
        <sup>2</sup> / <span className="text-text-muted">p</span>) / 100
      </div>
      <div className="text-text-faint text-xs">
        L = lightness &middot; <span className="text-text-faint">p</span> =
        adjustment
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Solution section - single CSS grid so all 3 visuals share one column width
// ---------------------------------------------------------------------------

function SolutionSection({ hue }: { hue: number }) {
  const { curveData, curvePath, fillPath, pickerCells } =
    useCurvePickerData(hue);

  return (
    <div className="border-border-default mt-2 mb-32 border-t pt-24">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-[1fr_1fr]">
        {/* Row 1: explanation text | animated picker */}
        <div>
          <p className="text-text-secondary mb-4 text-2xl font-semibold">
            The solution
          </p>
          <p className="text-text-muted mb-4 leading-relaxed">
            In a color picker, the boundary between neutral and chromatic is not
            a straight line. It follows a curve: colours at the extremes of
            lightness need more saturation to register as tinted, while midtones
            need less.
            <sup className="text-2xs text-text-faint ml-1">1</sup>
          </p>
          <p className="text-text-muted leading-relaxed">
            This boundary is approximately parabolic. It can be expressed as a
            formula that takes a lightness value and returns a saturation
            multiplier.
            <sup className="text-2xs text-text-faint ml-1">2</sup>
          </p>
        </div>
        <ColorPickerPlane hue={hue} />

        {/* Row 2: formula spanning both columns */}
        <div className="sm:col-span-2">
          <Formula />
        </div>

        {/* Row 3: curve graph | rotated picker */}
        <CurveGraph
          curvePath={curvePath}
          fillPath={fillPath}
          curveData={curveData}
        />
        <RotatedPicker pickerCells={pickerCells} curvePath={curvePath} />

        {/* Caption spanning both columns */}
        <p className="text-text-faint text-center text-base italic sm:col-span-2">
          The formula&rsquo;s curve (left) traces the perceptual boundary
          visible in the color field (right).
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hue picker - horizontal gradient bar for selecting hue angle
// ---------------------------------------------------------------------------

const HUE_PRESETS: { label: string; hue: number }[] = [
  { label: "Red", hue: 0 },
  { label: "Orange", hue: 30 },
  { label: "Gold", hue: 45 },
  { label: "Green", hue: 150 },
  { label: "Teal", hue: 180 },
  { label: "Blue", hue: 220 },
  { label: "Indigo", hue: 245 },
  { label: "Purple", hue: 280 },
  { label: "Rose", hue: 340 },
];

function HuePicker({
  hue,
  onChange,
  onReset,
  isDefault,
}: {
  hue: number;
  onChange: (h: number) => void;
  onReset: () => void;
  isDefault: boolean;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  const hueFromPointer = useCallback(
    (clientX: number) => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      onChange(Math.round(ratio * 360));
    },
    [onChange],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      hueFromPointer(e.clientX);
    },
    [hueFromPointer],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons === 0) return;
      hueFromPointer(e.clientX);
    },
    [hueFromPointer],
  );

  return (
    <div className="space-y-2">
      {/* Presets + reset */}
      <div className="flex items-center gap-1">
        {HUE_PRESETS.map((p) => (
          <button
            key={p.hue}
            onClick={() => onChange(p.hue)}
            title={`${p.label} (${p.hue}°)`}
            className="focus-visible:ring-offset-surface-overlay h-8 flex-1 rounded-none transition-shadow focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1"
            style={{
              backgroundColor: `hsl(${p.hue} 100% 50%)`,
              boxShadow:
                hue === p.hue ? "0 0 0 0.125rem hsl(0 0% 100%)" : "none",
            }}
          />
        ))}

        {/* Reset */}
        <button
          onClick={onReset}
          title={`Reset to ${DEFAULT_HUE}°`}
          className="focus-visible:ring-offset-surface-overlay grid h-5 w-5 flex-none place-items-center transition-opacity focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1"
          style={{ opacity: isDefault ? 0.25 : 0.7 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            className="text-text-muted"
          >
            <path
              d="M2 2v3h3M10 10V7H7"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 4.5A4 4 0 0 0 3.17 2.83L2 4M2.5 7.5A4 4 0 0 0 8.83 9.17L10 8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Gradient bar */}
      <div
        ref={barRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={hue}
        aria-label="Reference hue angle"
        className="relative h-6 cursor-crosshair rounded-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
        style={{
          background:
            "linear-gradient(to right, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 1;
          let next: number | null = null;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            next = (hue + step) % 360;
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            next = (hue - step + 360) % 360;
          }
          if (next !== null) {
            e.preventDefault();
            onChange(next);
          }
        }}
      >
        <div
          className="pointer-events-none absolute top-0 h-full w-1 -translate-x-1/2 rounded-none border border-white"
          style={{
            left: `${(hue / 360) * 100}%`,
            backgroundColor: `hsl(${hue} 100% 50%)`,
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported components
// ---------------------------------------------------------------------------

export function AboutButton() {
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(DEFAULT_HUE);
  const strips = useMemo(() => buildStrips(hue), [hue]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="text-text-faint hover:text-text-secondary hover:bg-surface-hover flex cursor-pointer items-center gap-1 rounded-none px-2 py-1 transition-colors"
          aria-label="About this tool"
        >
          <Info size={14} />
          <span className="inline text-sm">About this tool</span>
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.2 }}
                className="bg-surface-base border-border-elevated fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[calc(100vw-1rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border p-4 text-lg shadow-2xl sm:px-6 sm:py-12 lg:max-w-6xl"
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-[1fr_1.4fr] sm:gap-y-8">
                  {/* Title + intro - span both columns */}
                  <div className="mb-16 sm:col-span-2">
                    <Dialog.Title className="font-display text-text-primary mb-8 text-3xl font-semibold">
                      What is Chroma Curve for?
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                      Explanation of the parabolic saturation curve used to
                      generate perceptually balanced monochromatic palettes
                    </Dialog.Description>
                    <p className="text-text-secondary leading-relaxed">
                      Monochromatic palettes need saturation that varies with
                      lightness. <br />A fixed saturation value produces even
                      chroma in the midrange but loses it at the extremes, or
                      vice versa.
                    </p>
                  </div>

                  {/* Hue indicator */}
                  <div className="sm:col-start-2">
                    <Popover.Root>
                      <div className="relative">
                        <div
                          className="grid h-16"
                          style={{
                            gridTemplateColumns: `repeat(${STRIP_STEPS}, 1fr)`,
                          }}
                        >
                          <Popover.Trigger asChild>
                            <button
                              aria-label="Change reference hue"
                              className="h-full w-full cursor-pointer rounded-none transition-shadow hover:ring-1 hover:ring-white/20"
                              style={{
                                gridColumn: 5,
                                backgroundColor: `hsl(${hue} 100% 50%)`,
                              }}
                            />
                          </Popover.Trigger>
                        </div>
                        {/* Helper text */}
                        <div
                          className="text-text-muted absolute top-1/2 -translate-y-1/2 text-right text-sm leading-tight whitespace-nowrap"
                          style={{
                            right: `calc(${(STRIP_STEPS - 4) * (100 / STRIP_STEPS)}% + 14px)`,
                          }}
                        >
                          Reference hue for
                          <br />
                          examples below
                        </div>
                        {/* Values stacked vertically */}
                        <div
                          className="text-text-secondary absolute top-1/2 -translate-y-1/2 text-sm leading-tight whitespace-nowrap"
                          style={{
                            left: `calc(${5 * (100 / STRIP_STEPS)}% + 8px)`,
                          }}
                        >
                          <div className="p- flex flex-col gap-1">
                            <div className="flex gap-2">
                              <span>H:</span>
                              <span>{hue}°</span>
                            </div>
                            <div className="text-text-faint flex flex-col">
                              <div className="flex gap-2">
                                <span>S:</span>
                                <span>100%</span>
                              </div>
                              <div className="flex gap-2">
                                <span>L:</span>
                                <span>50%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Popover.Portal>
                        <Popover.Content
                          side="top"
                          sideOffset={4}
                          align="center"
                          className="bg-surface-overlay border-border-elevated z-[60] w-80 border p-2 shadow-xl"
                        >
                          <HuePicker
                            hue={hue}
                            onChange={setHue}
                            onReset={() => setHue(DEFAULT_HUE)}
                            isDefault={hue === DEFAULT_HUE}
                          />
                          <Popover.Arrow className="fill-surface-overlay" />
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  </div>

                  {/* Lightness header - right column only */}
                  <div className="sm:col-start-2">
                    <span className="text-text-muted mb-1 block text-xs tracking-wide">
                      Lightness
                    </span>
                    <LightnessHeader />
                  </div>

                  {/* 0% sat */}
                  <div>
                    <div className="mb-1 grid grid-cols-[1fr_auto] items-baseline gap-2">
                      <p className="text-text-secondary text-xl font-semibold">
                        Achromatic Baseline
                      </p>
                      <span className="text-text-muted text-xs tracking-wide">
                        Saturation: 0%
                      </span>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                      Unsaturated grayscale. Functional, but lacks character or
                      brand identity.
                    </p>
                  </div>
                  <Strip colors={strips.zero} />

                  {/* 20% sat */}
                  <div>
                    <div className="mb-1 grid grid-cols-[1fr_auto] items-baseline gap-2">
                      <p className="text-text-secondary text-xl font-semibold">
                        Fixed low saturation
                      </p>
                      <span className="text-text-muted text-xs tracking-wide">
                        Saturation: {Math.round(SAT_FOR_MID * 100)}%
                      </span>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                      Desired neutral midtones, but dark and light ends become
                      effectively desaturated.
                    </p>
                  </div>
                  <Strip colors={strips.forMid} mark={markForMid} />

                  {/* 40% sat */}
                  <div className="mb-12">
                    <div className="mb-1 grid grid-cols-[1fr_auto] items-baseline gap-2">
                      <p className="text-text-secondary text-xl font-semibold">
                        Fixed high saturation
                      </p>
                      <span className="text-text-muted text-xs tracking-wide">
                        Saturation: {Math.round(SAT_FOR_EXTREMES * 100)}%
                      </span>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                      Raising it to recover the extremes pushes the midrange to
                      be oversaturated.
                    </p>
                  </div>
                  <Strip colors={strips.forExtremes} mark={markForExtremes} />

                  {/* The solution - spans both columns, uses its own 1fr 1fr subgrid */}
                  <div className="sm:col-span-2">
                    <SolutionSection hue={hue} />
                  </div>

                  {/* Boundary strip */}
                  <div>
                    <div className="mb-1 grid grid-cols-[1fr_auto] items-baseline gap-2">
                      <p className="text-text-secondary font-semibold">
                        Perceptual boundary
                      </p>
                      <span className="text-2xs text-text-muted">
                        {"Saturation: "}
                        {Math.round(
                          BOUNDARY_SCALE *
                            getSaturation(
                              LIGHTNESS_LABELS[0],
                              REF_SMOD,
                              "endpoint",
                            ) *
                            100,
                        )}
                        {"/"}
                        {Math.round(
                          BOUNDARY_SCALE *
                            getSaturation(
                              LIGHTNESS_LABELS[4],
                              REF_SMOD,
                              "endpoint",
                            ) *
                            100,
                        )}
                        {"/"}
                        {Math.round(
                          BOUNDARY_SCALE *
                            getSaturation(
                              LIGHTNESS_LABELS[8],
                              REF_SMOD,
                              "endpoint",
                            ) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                      Sampling saturation along the curve produces even
                      perceived chroma, but is too saturated for neutrals.
                    </p>
                  </div>
                  <Strip colors={strips.boundary} mark={markCurved} />

                  {/* Final result strip */}
                  <div>
                    <div className="mb-1 grid grid-cols-[1fr_auto] items-baseline gap-2">
                      <p className="text-text-secondary font-semibold">
                        Adjusted curve
                      </p>
                      <span className="text-2xs text-text-muted">
                        {"Saturation: "}
                        {Math.round(
                          SAT_CURVED *
                            getSaturation(
                              LIGHTNESS_LABELS[0],
                              REF_SMOD,
                              "endpoint",
                            ) *
                            100,
                        )}
                        {"/"}
                        {Math.round(
                          SAT_CURVED *
                            getSaturation(
                              LIGHTNESS_LABELS[4],
                              REF_SMOD,
                              "endpoint",
                            ) *
                            100,
                        )}
                        {"/"}
                        {Math.round(
                          SAT_CURVED *
                            getSaturation(
                              LIGHTNESS_LABELS[8],
                              REF_SMOD,
                              "endpoint",
                            ) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                      Reducing the base saturation scales the whole curve down.
                      The formula preserves the ratio between midtones and
                      extremes at any base value.
                    </p>
                  </div>
                  <Strip colors={strips.curved} mark={markCurved} />
                </div>

                <div className="border-border-default text-text-faint mt-8 mb-16 flex flex-wrap gap-x-8 gap-y-2 border-t border-b py-4 text-xs tracking-wide">
                  <p>
                    <sup className="text-2xs text-text-faint mr-1">1</sup>
                    Concept from{" "}
                    <a
                      href="https://medium.com/design-bootcamp/the-secret-to-creating-neutral-color-palettes-5e5a650b1718"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-secondary underline underline-offset-2 transition-colors"
                    >
                      The secret to creating neutral color palettes
                    </a>{" "}
                    by Pablo Figueiredo.
                  </p>
                  <p>
                    <sup className="text-2xs text-text-faint mr-1">2</sup>
                    Formula adapted from{" "}
                    <a
                      href="https://www.desmos.com/calculator/02ufrfsuzy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-secondary underline underline-offset-2 transition-colors"
                    >
                      Desmos visualization
                    </a>{" "}
                    by Grant Kiely.
                  </p>
                </div>

                <div className="text-text-secondary mb-4 text-center text-base">
                  <p>
                    Chroma Curve is a tool by{" "}
                    <a
                      href="https://grantkeller.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-secondary underline underline-offset-2 transition-colors"
                    >
                      Grant Keller
                    </a>{" "}
                    from{" "}
                    <a
                      href="https://davantsystems.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-secondary underline underline-offset-2 transition-colors"
                    >
                      Davant Systems
                    </a>
                  </p>
                </div>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="text-text-faint hover:text-text-secondary absolute top-4 right-4 cursor-pointer transition-colors"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
