import { useCallback, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import chroma from "chroma-js";
import { getSaturation } from "../lib/palette";

const DEFAULT_HUE = 220;
const REF_SMOD = 40;
const STRIP_STEPS = 9;

// Saturation tuned for the midrange — extremes lose chroma
const SAT_FOR_MID = 0.20;
// Saturation tuned for the extremes — midtones are over-saturated
const SAT_FOR_EXTREMES = 0.40;
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
  Math.round(5 + i * (90 / (STRIP_STEPS - 1)))
);

// Scale factor so parabola edges reach 50% sat (perceptual boundary)
const BOUNDARY_SCALE = 0.5 / getSaturation(LIGHTNESS_LABELS[0], REF_SMOD);

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
        .hsl(hue, BOUNDARY_SCALE * getSaturation(lInt, REF_SMOD), l)
        .hex(),
    );
    curved.push(
      chroma
        .hsl(hue, SAT_CURVED * getSaturation(lInt, REF_SMOD), l)
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
        <span className="text-[9px] font-mono uppercase tracking-wider text-[hsl(0_0%_60%)] mb-1 block">{label}</span>
      )}
      <div className="grid rounded-lg overflow-hidden" style={{ gridTemplateColumns: `repeat(${colors.length}, 1fr)` }}>
        {colors.map((c) => (
          <div key={c} className="h-12" style={{ backgroundColor: c }} />
        ))}
      </div>
      {mark && (
        <div className="grid mt-1" style={{ gridTemplateColumns: `repeat(${colors.length}, 1fr)` }}>
          {colors.map((_, i) => {
            const m = mark(i);
            const text =
              m === "ok" ? "ok" : m === "high" ? "hi" : m === "low" ? "lo" : null;
            return (
              <div key={`mark-${i}`} className="text-center leading-1.5">
                {text && (
                  <span className={`text-[8px] font-mono ${m === "ok" ? "text-[hsl(0_0%_65%)]" : "text-[hsl(0_0%_40%)]"}`}>
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
    <div className="grid" style={{ gridTemplateColumns: `repeat(${LIGHTNESS_LABELS.length}, 1fr)` }}>
      {LIGHTNESS_LABELS.map((l) => (
        <div key={l} className="text-center text-[9px] font-mono text-[hsl(0_0%_60%)]">
          {l}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Color picker plane — saturation (x) vs lightness (y) with parabolic curve
// ---------------------------------------------------------------------------

function ColorPickerPlane({ hue }: { hue: number }) {
  const size = 200;
  const res = 40; // grid resolution
  const cellSize = size / res;

  const edgeMultiplier = getSaturation(0, REF_SMOD);
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
      const multiplier = getSaturation(l, REF_SMOD);
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
      const multiplier = getSaturation(lInt, REF_SMOD);
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
    <div className="flex gap-1.5">
      <span className="text-[10px] font-mono text-[hsl(0_0%_60%)] self-center" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
        Lightness
      </span>
      <div className="flex flex-col gap-1.5 w-full min-w-0">
        <div className="rounded overflow-hidden border border-white/[0.06]">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto block">
            {cells.map((c, i) => (
              <rect key={i} x={c.x} y={c.y} width={cellSize + 0.5} height={cellSize + 0.5} fill={c.color} />
            ))}
            {/* Clip mask for line: wipes top→bottom in, then top→bottom out */}
            <defs>
              <clipPath id="lineReveal">
                <motion.rect
                  x={0}
                  width={size}
                  initial={{ y: 0, height: 0 }}
                  animate={{
                    y:      [0, 0, 0,    0,    size],
                    height: [0, 0, size,  size, 0],
                  }}
                  transition={{
                    duration: cycle,
                    times: [
                      0,
                      pause / cycle,                                       // 2s: start draw
                      (pause + drawDur) / cycle,                           // 4s: fully revealed
                      (pause + drawDur + lineHold) / cycle,                // 5s: start exit
                      (pause + drawDur + lineHold + lineFade) / cycle,     // 6s: fully hidden
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
              const offStart = (swatchStart + swatchDraw + swatchHold + cell.stagger * (swatchFade / swatchDraw)) / cycle;
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
        <span className="text-[10px] font-mono text-[hsl(0_0%_60%)] text-center">
          Saturation
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Curve graph + rotated picker alignment (square, side-by-side)
// ---------------------------------------------------------------------------

function VisualPanel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex gap-1.5">
      <span
        className="text-[10px] font-mono text-[hsl(0_0%_60%)] self-center shrink-0"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {label}
      </span>
      <div className="w-full">{children}</div>
    </div>
  );
}

function useCurvePickerVisuals(hue: number) {
  const size = 200;
  const res = 40;
  const cellSize = size / res;

  // Shared Y-axis: full 0→1 saturation range (matches original picker)
  const edgeMult = getSaturation(0, REF_SMOD);
  const bScale = 0.5 / edgeMult;
  const maxSat = 1.0;

  // Shared coordinate mapping
  const toX = useCallback((l: number) => (l / 100) * size, []);
  const toY = useCallback((sat: number) => (1 - sat / maxSat) * size, []);

  const { pickerCells, curveData, curvePath, fillPath } = useMemo(() => {
    // Curve data: lightness → boundary saturation
    const curveData: { l: number; sat: number }[] = [];
    for (let l = 0; l <= 100; l += 2) {
      curveData.push({ l, sat: bScale * getSaturation(l, REF_SMOD) });
    }

    const curvePath = curveData
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${toX(p.l).toFixed(1)},${toY(p.sat).toFixed(1)}`,
      )
      .join("");

    const fillPath = `${curvePath} L${size},${size} L0,${size} Z`;

    // Rotated picker grid: x=lightness, y=saturation (high at top)
    const pickerCells: { x: number; y: number; color: string }[] = [];
    for (let row = 0; row < res; row++) {
      for (let col = 0; col < res; col++) {
        const light = col / (res - 1);
        const sat = (1 - row / (res - 1)) * maxSat;
        pickerCells.push({
          x: col * cellSize,
          y: row * cellSize,
          color: chroma.hsl(hue, sat, light).hex(),
        });
      }
    }

    return { pickerCells, curveData, curvePath, fillPath };
  }, [hue, bScale, cellSize, toX, toY]);

  // Saturation gridline values
  const satGridLines = [0.1, 0.2, 0.3, 0.4, 0.5];

  return {
    curveGraph: (
      <VisualPanel label="S(L)">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-auto block rounded border border-white/[0.06] bg-white/[0.02]"
        >
          {satGridLines.map((s) => (
            <line
              key={`h-${s}`}
              x1={0}
              y1={toY(s)}
              x2={size}
              y2={toY(s)}
              stroke="white"
              strokeOpacity={0.04}
              strokeWidth={0.5}
            />
          ))}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((l) => (
            <line
              key={`v-${l}`}
              x1={toX(l)}
              y1={0}
              x2={toX(l)}
              y2={size}
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
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={toX(50)}
            y={toY(curveData[25].sat) + 12}
            textAnchor="middle"
            className="text-[8px] fill-[hsl(0_0%_50%)] font-mono"
          >
            min
          </text>
        </svg>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] font-mono text-[hsl(0_0%_60%)]">0</span>
          <span className="text-[10px] font-mono text-[hsl(0_0%_60%)]">L</span>
          <span className="text-[10px] font-mono text-[hsl(0_0%_60%)]">100</span>
        </div>
      </VisualPanel>
    ),
    rotatedPicker: (
      <VisualPanel label="Saturation">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-auto block rounded border border-white/[0.06] overflow-hidden"
        >
          {pickerCells.map((c, i) => (
            <rect
              key={i}
              x={c.x}
              y={c.y}
              width={cellSize + 0.5}
              height={cellSize + 0.5}
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
          <span className="text-[10px] font-mono text-[hsl(0_0%_60%)]">Lightness</span>
        </div>
      </VisualPanel>
    ),
  };
}

function Formula() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono text-[11px] text-white/45 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <span className="text-white/60">S</span>(L) = 1 + ((L - 50)
        <sup>2</sup> / <span className="text-white/60">p</span> - 50
        <sup>2</sup> / <span className="text-white/60">p</span>) / 100
      </div>
      <div className="text-[10px] text-white/25">
        L = lightness &middot;{" "}
        <span className="text-white/40">p</span> = adjustment
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Solution section — single CSS grid so all 3 visuals share one column width
// ---------------------------------------------------------------------------

function SolutionSection({ hue }: { hue: number }) {
  const { curveGraph, rotatedPicker } = useCurvePickerVisuals(hue);

  return (
    <div className="mt-2 pt-8 border-t border-white/[0.06]">
      <div className="grid grid-cols-[1fr_1fr] gap-x-6 gap-y-4">
        {/* Row 1: explanation text | animated picker */}
        <div>
          <p className="text-[13px] font-semibold text-white/70 mb-3">The solution</p>
          <p className="text-[13px] leading-relaxed text-white/45 mb-3">
            In a color picker, the boundary between neutral and
            chromatic is not a straight line. It follows a curve:
            colours at the extremes of lightness need more
            saturation to register as tinted, while midtones
            need less.
            <sup className="text-[9px] text-white/25 ml-0.5">1</sup>
          </p>
          <p className="text-[13px] leading-relaxed text-white/45">
            This boundary is approximately parabolic. It can be
            expressed as a formula that takes a lightness value
            and returns a saturation multiplier.
            <sup className="text-[9px] text-white/25 ml-0.5">2</sup>
          </p>
        </div>
        <ColorPickerPlane hue={hue} />

        {/* Row 2: formula spanning both columns */}
        <div className="col-span-2">
          <Formula />
        </div>

        {/* Row 3: curve graph | rotated picker */}
        {curveGraph}
        {rotatedPicker}

        {/* Caption spanning both columns */}
        <p className="col-span-2 text-[11px] text-white/25 text-center">
          The formula&rsquo;s curve (left) traces the perceptual boundary visible in the color field (right).
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hue picker — horizontal gradient bar for selecting hue angle
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

  const hueFromPointer = useCallback((clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange(Math.round(ratio * 360));
  }, [onChange]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    hueFromPointer(e.clientX);
  }, [hueFromPointer]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return;
    hueFromPointer(e.clientX);
  }, [hueFromPointer]);

  return (
    <div className="space-y-2">
      {/* Presets + reset */}
      <div className="flex items-center gap-1.5">
        {HUE_PRESETS.map((p) => (
          <button
            key={p.hue}
            onClick={() => onChange(p.hue)}
            title={`${p.label} (${p.hue}°)`}
            className="h-5 flex-1 rounded-sm transition-shadow focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[hsl(0_0%_10%)]"
            style={{
              backgroundColor: `hsl(${p.hue} 100% 50%)`,
              boxShadow: hue === p.hue ? "0 0 0 1.5px hsl(0 0% 80%)" : "none",
            }}
          />
        ))}

        {/* Reset */}
        <button
          onClick={onReset}
          title={`Reset to ${DEFAULT_HUE}°`}
          className="h-5 w-5 flex-none grid place-items-center rounded-sm transition-opacity focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[hsl(0_0%_10%)]"
          style={{ opacity: isDefault ? 0.25 : 0.7 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[hsl(0_0%_60%)]">
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
        className="h-6 rounded-sm cursor-crosshair relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{
          background: "linear-gradient(to right, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))",
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
          className="absolute top-0 h-full w-1 -translate-x-1/2 border border-white rounded-sm pointer-events-none"
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
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="About this tool"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 7v4.5M8 4.5v.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.2 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl p-6 rounded-2xl bg-[hsl(0_0%_6%)] border border-white/[0.08] shadow-2xl max-h-[85vh] overflow-y-auto"
              >
                <div className="grid grid-cols-[1fr_1.4fr] gap-x-6 gap-y-8">
                  {/* Title + intro — span both columns */}
                  <div className="col-span-2">
                    <Dialog.Title className="text-lg font-semibold text-white/90 mb-2">
                      How it works
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                      Explanation of the parabolic saturation curve used to generate neutral palettes
                    </Dialog.Description>
                    <p className="text-[13px] leading-relaxed text-white/50">
                      Neutral palettes need saturation that varies with lightness.
                      A fixed saturation value always compromises one end of the
                      scale.
                    </p>
                  </div>

                  {/* Hue indicator — swatch aligned with L=50, labels flanking it */}
                  <div className="col-start-2">
                    <Popover.Root>
                      <div className="relative">
                        <div className="grid" style={{ gridTemplateColumns: `repeat(${STRIP_STEPS}, 1fr)` }}>
                          {Array.from({ length: STRIP_STEPS }, (_, i) => (
                            <div key={i} className="h-12">
                              {i === 4 && (
                                <Popover.Trigger asChild>
                                  <button
                                    aria-label="Change reference hue"
                                    className="h-full w-full rounded-sm cursor-pointer hover:ring-1 hover:ring-white/20 transition-shadow"
                                    style={{ backgroundColor: `hsl(${hue} 100% 50%)` }}
                                  />
                                </Popover.Trigger>
                              )}
                            </div>
                          ))}
                        </div>
                        {/* Helper text, right-aligned to swatch left edge */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono text-[hsl(0_0%_50%)] whitespace-nowrap leading-tight text-right"
                          style={{ right: `calc(${(STRIP_STEPS - 4) * (100 / STRIP_STEPS)}% + 14px)` }}
                        >
                          Reference hue for<br />examples below
                        </div>
                        {/* Values stacked vertically, left-aligned to swatch right edge */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono text-[hsl(0_0%_50%)] whitespace-nowrap leading-tight"
                          style={{ left: `calc(${5 * (100 / STRIP_STEPS)}% + 8px)` }}
                        >
                          <div className="grid grid-cols-[auto_1fr] gap-x-1">
                            <span className="text-[13px]">H:</span>
                            <span className="text-[13px]">{hue}°</span>
                            <span className="text-[hsl(0_0%_35%)]">S:</span>
                            <span className="text-[hsl(0_0%_35%)]">100%</span>
                            <span className="text-[hsl(0_0%_35%)]">L:</span>
                            <span className="text-[hsl(0_0%_35%)]">50%</span>
                          </div>
                        </div>
                      </div>
                      <Popover.Portal>
                        <Popover.Content
                          side="right"
                          sideOffset={12}
                          align="center"
                          className="w-56 p-3 rounded-lg bg-[hsl(0_0%_10%)] border border-white/[0.08] shadow-xl z-[60]"
                        >
                          <HuePicker
                            hue={hue}
                            onChange={setHue}
                            onReset={() => setHue(DEFAULT_HUE)}
                            isDefault={hue === DEFAULT_HUE}
                          />
                          <Popover.Arrow className="fill-[hsl(0_0%_10%)]" />
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  </div>

                  {/* Lightness header — right column only */}
                  <div className="col-start-2">
                    <span className="text-[10px] font-mono text-[hsl(0_0%_60%)] mb-1 block">Lightness</span>
                    <LightnessHeader />
                  </div>

                  {/* 0% sat */}
                  <div>
                    <div className="grid grid-cols-[1fr_auto] items-baseline gap-2 mb-1">
                      <p className="text-[13px] font-semibold text-white/70">Achromatic Baseline</p>
                      <span className="text-[10px] font-mono text-[hsl(0_0%_60%)]">Saturation: 0%</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/45">
                      Unsaturated grayscale. Functional, but lacks character or brand identity.
                    </p>
                  </div>
                  <Strip colors={strips.zero} />

                  {/* 20% sat */}
                  <div>
                    <div className="grid grid-cols-[1fr_auto] items-baseline gap-2 mb-1">
                      <p className="text-[13px] font-semibold text-white/70">Fixed low saturation</p>
                      <span className="text-[10px] font-mono text-[hsl(0_0%_60%)]">Saturation: {Math.round(SAT_FOR_MID * 100)}%</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/45">
                      Desired neutral midtones, but dark and light ends become effectively desaturated.
                    </p>
                  </div>
                  <Strip colors={strips.forMid} mark={markForMid} />

                  {/* 40% sat */}
                  <div>
                    <div className="grid grid-cols-[1fr_auto] items-baseline gap-2 mb-1">
                      <p className="text-[13px] font-semibold text-white/70">Fixed high saturation</p>
                      <span className="text-[10px] font-mono text-[hsl(0_0%_60%)]">Saturation: {Math.round(SAT_FOR_EXTREMES * 100)}%</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/45">
                      Raising it to recover the extremes pushes the midrange
                      to be oversaturated.
                    </p>
                  </div>
                  <Strip colors={strips.forExtremes} mark={markForExtremes} />

                  {/* The solution — spans both columns, uses its own 1fr 1fr subgrid */}
                  <div className="col-span-2">
                    <SolutionSection hue={hue} />
                  </div>

                  {/* Boundary strip */}
                  <div>
                    <div className="grid grid-cols-[1fr_auto] items-baseline gap-2 mb-1">
                      <p className="text-[13px] font-semibold text-white/70">Perceptual boundary</p>
                      <span className="text-[10px] font-mono text-[hsl(0_0%_60%)]">
                        {"Saturation: "}
                        {Math.round(BOUNDARY_SCALE * getSaturation(LIGHTNESS_LABELS[0], REF_SMOD) * 100)}
                        {"/"}
                        {Math.round(BOUNDARY_SCALE * getSaturation(LIGHTNESS_LABELS[4], REF_SMOD) * 100)}
                        {"/"}
                        {Math.round(BOUNDARY_SCALE * getSaturation(LIGHTNESS_LABELS[8], REF_SMOD) * 100)}%
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/45">
                      Sampling saturation along the curve produces even
                      perceived chroma, but is too saturated for neutrals.
                    </p>
                  </div>
                  <Strip colors={strips.boundary} mark={markCurved} />

                  {/* Final result strip */}
                  <div>
                    <div className="grid grid-cols-[1fr_auto] items-baseline gap-2 mb-1">
                      <p className="text-[13px] font-semibold text-white/70">Adjusted curve</p>
                      <span className="text-[10px] font-mono text-[hsl(0_0%_60%)]">
                        {"Saturation: "}
                        {Math.round(SAT_CURVED * getSaturation(LIGHTNESS_LABELS[0], REF_SMOD) * 100)}
                        {"/"}
                        {Math.round(SAT_CURVED * getSaturation(LIGHTNESS_LABELS[4], REF_SMOD) * 100)}
                        {"/"}
                        {Math.round(SAT_CURVED * getSaturation(LIGHTNESS_LABELS[8], REF_SMOD) * 100)}%
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/45">
                      Reducing the base saturation scales the whole curve
                      down. The formula preserves the ratio between
                      midtones and extremes at any base value.
                    </p>
                  </div>
                  <Strip colors={strips.curved} mark={markCurved} />
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] text-[11px] text-white/30 grid gap-1.5">
                  <p>
                    <sup className="text-[9px] text-white/25 mr-1">1</sup>
                    Concept from{" "}
                    <a
                      href="https://medium.com/design-bootcamp/the-secret-to-creating-neutral-color-palettes-5e5a650b1718"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white/70 underline underline-offset-2 transition-colors"
                    >
                      The secret to creating neutral color palettes
                    </a>
                    {" "}by Pablo Figueiredo.
                  </p>
                  <p>
                    <sup className="text-[9px] text-white/25 mr-1">2</sup>
                    Formula adapted from{" "}
                    <a
                      href="https://www.desmos.com/calculator/02ufrfsuzy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white/70 underline underline-offset-2 transition-colors"
                    >
                      Desmos visualization
                    </a>
                    {" "}by Grant Kiely.
                  </p>
                </div>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <path
                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
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

