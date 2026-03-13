import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import chroma from "chroma-js";
import { getSaturation } from "../lib/palette";

const REF_HUE = 220;
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

function buildStrips() {
  const zero: string[] = [];
  const forMid: string[] = [];
  const forExtremes: string[] = [];
  const curved: string[] = [];
  for (let i = 0; i < STRIP_STEPS; i++) {
    const lInt = 5 + i * (90 / (STRIP_STEPS - 1)); // L5 through L95
    const l = lInt / 100;
    zero.push(chroma.hsl(REF_HUE, 0, l).hex());
    forMid.push(chroma.hsl(REF_HUE, SAT_FOR_MID, l).hex());
    forExtremes.push(chroma.hsl(REF_HUE, SAT_FOR_EXTREMES, l).hex());
    curved.push(
      chroma
        .hsl(REF_HUE, SAT_CURVED * getSaturation(lInt, REF_SMOD), l)
        .hex(),
    );
  }
  return { zero, forMid, forExtremes, curved };
}

// Lightness step labels
const LIGHTNESS_LABELS = Array.from({ length: STRIP_STEPS }, (_, i) =>
  Math.round(5 + i * (90 / (STRIP_STEPS - 1)))
);

interface StripProps {
  colors: string[];
  label?: string;
  mark?: (index: number) => SwatchMark;
}

function Strip({ colors, label, mark }: StripProps) {
  return (
    <div>
      {label && (
        <span className="text-[9px] font-mono uppercase tracking-wider text-white/20 mb-1 block">{label}</span>
      )}
      <div className="flex rounded-lg overflow-hidden">
        {colors.map((c, i) => (
          <div key={i} className="flex-1 h-12" style={{ backgroundColor: c }} />
        ))}
      </div>
      {mark && (
        <div className="flex mt-1">
          {colors.map((_, i) => {
            const m = mark(i);
            const text =
              m === "ok" ? "ok" : m === "high" ? "hi" : m === "low" ? "lo" : null;
            return (
              <div key={i} className="flex-1 text-center leading-1.5">
                {text && (
                  <span className={`text-[8px] font-mono ${m === "ok" ? "text-white/75" : "text-white/25"}`}>
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
    <div className="flex">
      {LIGHTNESS_LABELS.map((l) => (
        <div key={l} className="flex-1 text-center text-[9px] font-mono text-white/20">
          {l}
        </div>
      ))}
    </div>
  );
}

const strips = buildStrips();

// ---------------------------------------------------------------------------
// Curve + formula figure (compact, shown below the explanation)
// ---------------------------------------------------------------------------

function CurveAndFormula() {
  const w = 480;
  const h = 140;
  const pad = { l: 40, r: 12, t: 16, b: 24 };
  const pw = w - pad.l - pad.r;
  const ph = h - pad.t - pad.b;

  const points: { x: number; y: number }[] = [];
  for (let l = 0; l <= 100; l += 2) {
    points.push({ x: l, y: getSaturation(l, REF_SMOD) });
  }
  const allY = points.map((p) => p.y);
  const yMin = Math.min(...allY) * 0.92;
  const yMax = Math.max(...allY) * 1.06;

  const toX = (l: number) => pad.l + (l / 100) * pw;
  const toY = (v: number) => pad.t + (1 - (v - yMin) / (yMax - yMin)) * ph;

  const d = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${toX(p.x).toFixed(1)},${toY(p.y).toFixed(1)}`,
    )
    .join("");

  const baselineY = toY(1);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        {/* Baseline */}
        <line
          x1={pad.l}
          y1={baselineY}
          x2={w - pad.r}
          y2={baselineY}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        <text
          x={pad.l - 6}
          y={baselineY + 3}
          textAnchor="end"
          className="text-[8px] fill-white/25 font-mono"
        >
          1.0x
        </text>

        {/* Fill under curve */}
        <path
          d={`${d} L${toX(100).toFixed(1)},${(pad.t + ph).toFixed(1)} L${toX(0).toFixed(1)},${(pad.t + ph).toFixed(1)} Z`}
          fill="url(#aboutCurveFill)"
        />
        <defs>
          <linearGradient id="aboutCurveFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(38 90% 55%)"
              stopOpacity="0.1"
            />
            <stop
              offset="100%"
              stopColor="hsl(38 90% 55%)"
              stopOpacity="0.01"
            />
          </linearGradient>
        </defs>

        {/* Curve */}
        <path
          d={d}
          fill="none"
          stroke="hsl(38 90% 55%)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Annotations */}
        <text
          x={toX(50)}
          y={toY(getSaturation(50, REF_SMOD)) + 14}
          textAnchor="middle"
          className="text-[9px] fill-white/25 font-mono"
        >
          min at L=50
        </text>

        {/* X axis */}
        <text
          x={toX(0)}
          y={h - 4}
          className="text-[8px] fill-white/15 font-mono"
        >
          dark
        </text>
        <text
          x={toX(50)}
          y={h - 4}
          textAnchor="middle"
          className="text-[8px] fill-white/15 font-mono"
        >
          lightness
        </text>
        <text
          x={toX(100)}
          y={h - 4}
          textAnchor="end"
          className="text-[8px] fill-white/15 font-mono"
        >
          light
        </text>
      </svg>

      {/* Formula row */}
      <div className="px-4 py-2.5 border-t border-white/[0.06] bg-black/30 font-mono text-[11px] text-white/45 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-amber-400/60">S</span>(L) = 1 + ((L - 50)
          <sup>2</sup> / <span className="text-amber-400/60">p</span> - 50
          <sup>2</sup> / <span className="text-amber-400/60">p</span>) / 100
        </div>
        <div className="text-[10px] text-white/25">
          L = lightness &middot;{" "}
          <span className="text-amber-400/40">p</span> = adjustment
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported components
// ---------------------------------------------------------------------------

export function AboutButton() {
  const [open, setOpen] = useState(false);

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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl p-6 rounded-2xl bg-[hsl(220_10%_6%)] border border-white/[0.08] shadow-2xl max-h-[85vh] overflow-y-auto"
              >
                <Dialog.Title className="text-lg font-semibold text-white/90 mb-2">
                  How it works
                </Dialog.Title>

                <p className="text-[13px] leading-relaxed text-white/50 mb-6">
                  Neutral palettes need saturation that varies with lightness.
                  A fixed saturation value always compromises one end of the
                  scale.
                </p>

                <div className="space-y-5">
                  {/* Table of strips */}
                  <div className="grid grid-cols-[1fr_1.4fr] gap-x-6 gap-y-4 items-center">
                    {/* Header row */}
                    <div />
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Lightness</span>
                      </div>
                      <LightnessHeader />
                    </div>

                    {/* 0% sat */}
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="text-[13px] font-semibold text-white/70">Achromatic Baseline</p>
                        <span className="text-[10px] font-mono text-white/25">Saturation: 0%</span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-white/45">
                        Unsaturated grayscale. Functional, but lacks character or brand identity.
                      </p>
                    </div>
                    <Strip colors={strips.zero} />

                    {/* 20% sat */}
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="text-[13px] font-semibold text-white/70">Fixed low saturation</p>
                        <span className="text-[10px] font-mono text-white/25">Saturation: {Math.round(SAT_FOR_MID * 100)}%</span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-white/45">
                        Desired neutral midtones, but dark and light ends become effectively desaturated.
                      </p>
                    </div>
                    <Strip colors={strips.forMid} mark={markForMid} />

                    {/* 40% sat */}
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="text-[13px] font-semibold text-white/70">Fixed high saturation</p>
                        <span className="text-[10px] font-mono text-white/25">Saturation: {Math.round(SAT_FOR_EXTREMES * 100)}%</span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-white/45">
                        Raising it to recover the extremes pushes the midrange
                        to be oversaturated.
                      </p>
                    </div>
                    <Strip colors={strips.forExtremes} mark={markForExtremes} />

                    {/* Curved */}
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="text-[13px] font-semibold text-white/70">Parabolic curve</p>
                        <span className="text-[10px] font-mono text-white/25">
                          {"Saturation: "}
                          {Math.round(SAT_CURVED * getSaturation(LIGHTNESS_LABELS[0], REF_SMOD) * 100)}
                          {"/"}
                          {Math.round(SAT_CURVED * getSaturation(LIGHTNESS_LABELS[4], REF_SMOD) * 100)}
                          {"/"}
                          {Math.round(SAT_CURVED * getSaturation(LIGHTNESS_LABELS[8], REF_SMOD) * 100)}%
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-white/45">
                        Compensates edges up and middle down to keep chroma visually consistent.
                      </p>
                    </div>
                    <Strip colors={strips.curved} mark={markCurved} />
                  </div>

                  {/* Graph + formula */}
                  <details className="group">
                    <summary className="text-[12px] font-medium text-white/35 cursor-pointer hover:text-white/50 transition-colors select-none mb-3">
                      The math
                    </summary>
                    <div className="mb-1">
                      <CurveAndFormula />
                    </div>
                  </details>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] text-white/30">
                  Based on{" "}
                  <a
                    href="https://www.desmos.com/calculator/02ufrfsuzy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400/50 hover:text-amber-400/70 underline underline-offset-2 transition-colors"
                  >
                    this Desmos formula
                  </a>
                  , inspired by{" "}
                  <a
                    href="https://medium.com/design-bootcamp/the-secret-to-creating-neutral-color-palettes-5e5a650b1718"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400/50 hover:text-amber-400/70 underline underline-offset-2 transition-colors"
                  >
                    this article
                  </a>
                  .
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

export function AboutCaption() {
  return (
    <p className="text-[11px] text-white/30 mx-4 mt-1 mb-2">
      Saturation is modulated by a parabolic curve across lightness. Click a
      swatch to copy its value. Use Export for CSS, Tailwind, or JSON tokens.
    </p>
  );
}
