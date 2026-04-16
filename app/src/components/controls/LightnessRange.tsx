import { useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Lock, LockOpen } from "@phosphor-icons/react";
import { usePaletteStore } from "../../store/paletteStore";

export function LightnessRange() {
  const lMin = usePaletteStore((s) => s.lMin);
  const lMax = usePaletteStore((s) => s.lMax);
  const setLRange = usePaletteStore((s) => s.setLRange);
  const [locked, setLocked] = useState(false);
  const prevRef = useRef({ lMin, lMax });

  function handleChange([newMin, newMax]: number[]) {
    if (!locked) {
      prevRef.current = { lMin: newMin, lMax: newMax };
      setLRange(newMin, newMax);
      return;
    }

    const minDelta = newMin - prevRef.current.lMin;
    const maxDelta = newMax - prevRef.current.lMax;

    let finalMin: number;
    let finalMax: number;

    if (minDelta !== 0) {
      // Min thumb moved right → max thumb moves left by same amount
      finalMin = newMin;
      finalMax = Math.max(prevRef.current.lMax - minDelta, finalMin + 1);
    } else {
      // Max thumb moved left → min thumb moves right by same amount
      finalMax = newMax;
      finalMin = Math.min(prevRef.current.lMin - maxDelta, finalMax - 1);
    }

    finalMin = Math.max(0, finalMin);
    finalMax = Math.min(100, finalMax);

    prevRef.current = { lMin: finalMin, lMax: finalMax };
    setLRange(finalMin, finalMax);
  }

  return (
    <div className="flex min-w-[140px] flex-1 flex-col gap-1 sm:min-w-[200px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-text-muted flex h-6 items-center text-sm font-semibold tracking-wider uppercase">
          Range
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocked(!locked)}
            className={`flex h-6 cursor-pointer items-center px-1 text-sm transition-colors ${locked ? "text-text-primary" : "text-text-faint"}`}
            title={locked ? "Unlock range" : "Lock range span"}
          >
            {locked ? <Lock size={14} weight="fill" /> : <LockOpen size={14} />}
            <span className="ml-1 leading-none">
              {locked ? "locked" : "lock"}
            </span>
          </button>
          <span className="text-text-primary inline-flex items-center text-base tabular-nums">
            <span className="w-[2ch] text-right">{lMin}</span>
            <span>–</span>
            <span className="w-[3ch]">{lMax}</span>
          </span>
        </div>
      </div>
      <Slider.Root
        className="relative flex h-5 cursor-pointer touch-none items-center select-none"
        value={[lMin, lMax]}
        min={0}
        max={100}
        step={1}
        minStepsBetweenThumbs={1}
        onValueChange={handleChange}
      >
        <Slider.Track
          className="relative h-[6px] grow overflow-hidden rounded-full"
          style={{
            background:
              "linear-gradient(to right, hsl(0 0% 0%), hsl(0 0% 100%))",
          }}
        >
          <Slider.Range className="bg-surface-active-hover absolute h-full rounded-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border-2 border-white bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)] transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
          aria-label="Minimum lightness"
        />
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border-2 border-white bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)] transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
          aria-label="Maximum lightness"
        />
      </Slider.Root>
    </div>
  );
}
