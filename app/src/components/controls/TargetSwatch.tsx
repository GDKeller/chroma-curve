import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import chroma from "chroma-js";
import * as Popover from "@radix-ui/react-popover";
import { X } from "@phosphor-icons/react";
import { usePaletteStore } from "../../store/paletteStore";
import { parseTargetColor, formatTargetColor } from "../../lib/colors";
import type { ColorFormat } from "../../lib/colors";

const PICKER_SIZE = 200;

function ColorInput({
  currentHex,
  targetInput,
  targetFormat,
  hue,
  saturation,
  onApply,
}: {
  currentHex: string;
  targetInput: string | null;
  targetFormat: ColorFormat | null;
  hue: number;
  saturation: number;
  onApply: (hue: number, saturation: number, input: string, format: ColorFormat) => void;
}) {
  const [value, setValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const targetFormatted = targetFormat
    ? formatTargetColor(hue, saturation, targetFormat)
    : currentHex;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const result = parseTargetColor(value);
      if (result) {
        onApply(result.hue, result.saturation, value.trim(), result.format);
        setValue("");
        setIsInvalid(false);
      } else {
        setIsInvalid(true);
      }
    } else if (e.key === "Escape") {
      setValue("");
      setIsInvalid(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="mt-2">
      <div className="mb-1.5">
        {targetInput ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5 text-xs font-mono">
              <span className="text-text-secondary">{targetInput}</span>
              <span className="text-text-faint">→</span>
              <span className="text-text-primary">{targetFormatted}</span>
            </div>
            <span className="text-4xs text-text-faint uppercase tracking-wider">
              hue + saturation at L50
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-3xs text-text-faint uppercase tracking-wider">Target</span>
            <span className="text-xs font-mono text-text-secondary">{currentHex}</span>
          </div>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setIsInvalid(false);
        }}
        onKeyDown={handleKeyDown}
        placeholder="#hex, rgb(), hsl(), oklch()"
        className={`w-full bg-surface-base border px-2 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-faint outline-none transition-colors ${isInvalid ? "border-red-500" : "border-border-default focus:border-text-faint"}`}
      />
    </div>
  );
}

export function TargetSwatch() {
  const hue = usePaletteStore((s) => s.hue);
  const saturation = usePaletteStore((s) => s.saturation);
  const setHue = usePaletteStore((s) => s.setHue);
  const setSaturation = usePaletteStore((s) => s.setSaturation);
  const targetInput = usePaletteStore((s) => s.targetInput);
  const targetFormat = usePaletteStore((s) => s.targetFormat);
  const targetHue = usePaletteStore((s) => s.targetHue);
  const targetSat = usePaletteStore((s) => s.targetSat);
  const setTarget = usePaletteStore((s) => s.setTarget);
  const clearTarget = usePaletteStore((s) => s.clearTarget);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef(false);

  const targetActive = targetInput !== null;
  const targetDrifted = targetActive && (hue !== targetHue || saturation !== targetSat);

  const color = `hsl(${hue}, ${saturation * 100}%, 50%)`;
  const currentHex = useMemo(() => chroma.hsl(hue, saturation, 0.5).hex(), [hue, saturation]);
  const ringColor = useMemo(
    () => (targetActive && !targetDrifted && targetHue !== null ? `hsl(${targetHue}, 80%, 55%)` : null),
    [targetActive, targetDrifted, targetHue],
  );

  const drawPicker = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = PICKER_SIZE;
      const h = PICKER_SIZE;

      // Draw hue (x) vs saturation (y) at L=50%
      const imageData = ctx.createImageData(w, h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const h360 = (x / (w - 1)) * 360;
          const s = 1 - y / (h - 1);
          // HSL to RGB conversion
          const c = (1 - Math.abs(2 * 0.5 - 1)) * s;
          const hp = h360 / 60;
          const x2 = c * (1 - Math.abs((hp % 2) - 1));
          let r1 = 0,
            g1 = 0,
            b1 = 0;
          if (hp < 1) {
            r1 = c;
            g1 = x2;
          } else if (hp < 2) {
            r1 = x2;
            g1 = c;
          } else if (hp < 3) {
            g1 = c;
            b1 = x2;
          } else if (hp < 4) {
            g1 = x2;
            b1 = c;
          } else if (hp < 5) {
            r1 = x2;
            b1 = c;
          } else {
            r1 = c;
            b1 = x2;
          }
          const m = 0.5 - c / 2;
          const i = (y * w + x) * 4;
          imageData.data[i] = Math.round((r1 + m) * 255);
          imageData.data[i + 1] = Math.round((g1 + m) * 255);
          imageData.data[i + 2] = Math.round((b1 + m) * 255);
          imageData.data[i + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // Draw crosshair at current hue/sat position
      const cx = (hue / 360) * (w - 1);
      const cy = (1 - saturation) * (h - 1);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.stroke();
    },
    [hue, saturation],
  );

  const handleCanvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      canvasRef.current = canvas;
      if (canvas) drawPicker(canvas);
    },
    [drawPicker],
  );

  const pickFromCoords = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) return;
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      clearTarget();
      setHue(Math.round(x * 360));
      setSaturation(parseFloat((1 - y).toFixed(2)));
    },
    [setHue, setSaturation, clearTarget],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      draggingRef.current = true;
      pickFromCoords(e.clientX, e.clientY);
    },
    [pickFromCoords],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingRef.current) pickFromCoords(e.clientX, e.clientY);
    };
    const handleMouseUp = () => {
      draggingRef.current = false;
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pickFromCoords]);

  return (
    <Popover.Root>
      <div className="relative shrink-0 self-end group">
        <Popover.Trigger asChild>
          <button
            type="button"
            className="flex flex-col items-center gap-1 cursor-pointer"
            aria-label={
              targetActive
                ? `Target color: ${targetInput}${targetDrifted ? " (drifted)" : ""}`
                : `Current color: ${currentHex}`
            }
          >
            <div
              className="w-7 h-7 rounded-full transition-transform group-hover:scale-110"
              style={{
                backgroundColor: color,
                border: ringColor ? `2px solid ${ringColor}` : "2px solid var(--color-surface-base)",
                boxShadow: ringColor
                  ? `0 0 0 1px ${ringColor}`
                  : targetDrifted
                    ? "0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 1px rgba(0,0,0,0.3)"
                    : "0 0 0 1px rgba(255,255,255,0.15)",
                opacity: targetDrifted ? 0.6 : 1,
              }}
            />
            <span
              className={`text-3xs font-mono transition-colors ${
                targetActive && !targetDrifted ? "text-text-secondary" : "text-text-faint"
              }`}
            >
              {currentHex}
            </span>
          </button>
        </Popover.Trigger>
        {targetActive && (
          <button
            type="button"
            onClick={clearTarget}
            aria-label="Clear target color"
            className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-surface-overlay border border-border-elevated text-text-secondary opacity-0 group-hover:opacity-100 hover:text-text-primary hover:bg-surface-hover transition-opacity z-10"
          >
            <X size={10} weight="bold" />
          </button>
        )}
      </div>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="rounded-none bg-surface-overlay border border-border-elevated shadow-xl p-3 z-[60]"
        >
          <canvas
            ref={handleCanvasRef}
            width={PICKER_SIZE}
            height={PICKER_SIZE}
            className="cursor-crosshair block"
            style={{ width: PICKER_SIZE, height: PICKER_SIZE }}
            onMouseDown={handleMouseDown}
          />
          <div className="flex justify-between mt-2 text-sm text-text-faint">
            <span>Hue {hue}°</span>
            <span>Sat {Math.round(saturation * 100)}%</span>
          </div>
          <ColorInput
            currentHex={currentHex}
            targetInput={targetInput}
            targetFormat={targetFormat}
            hue={hue}
            saturation={saturation}
            onApply={setTarget}
          />
          <Popover.Arrow className="fill-surface-overlay" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
