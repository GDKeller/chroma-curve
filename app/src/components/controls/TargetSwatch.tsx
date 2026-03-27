import { useCallback, useEffect, useRef } from "react";
import * as Popover from "@radix-ui/react-popover";
import { usePaletteStore } from "../../store/paletteStore";

const PICKER_SIZE = 200;

export function TargetSwatch() {
  const hue = usePaletteStore((s) => s.hue);
  const saturation = usePaletteStore((s) => s.saturation);
  const setHue = usePaletteStore((s) => s.setHue);
  const setSaturation = usePaletteStore((s) => s.setSaturation);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef(false);

  const color = `hsl(${hue}, ${saturation * 100}%, 50%)`;

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
      setHue(Math.round(x * 360));
      setSaturation(parseFloat((1 - y).toFixed(2)));
    },
    [setHue, setSaturation],
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
      <Popover.Trigger asChild>
        <button
          type="button"
          className="w-7 h-7 rounded-full shrink-0 self-end mb-[2px] border-2 border-surface-base cursor-pointer transition-transform hover:scale-110 shadow-[0_0_0_1px_rgba(255,255,255,0.15)]"
          style={{ backgroundColor: color }}
          aria-label={`Target color: hue ${hue}°, saturation ${Math.round(saturation * 100)}%`}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="rounded-lg bg-surface-overlay border border-border-elevated shadow-xl p-3 z-[60]"
        >
          <canvas
            ref={handleCanvasRef}
            width={PICKER_SIZE}
            height={PICKER_SIZE}
            className="rounded cursor-crosshair block"
            style={{ width: PICKER_SIZE, height: PICKER_SIZE }}
            onMouseDown={handleMouseDown}
          />
          <div className="flex justify-between mt-2 text-[10px] font-mono text-text-subtle">
            <span>Hue {hue}°</span>
            <span>Sat {Math.round(saturation * 100)}%</span>
          </div>
          <Popover.Arrow className="fill-surface-overlay" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
