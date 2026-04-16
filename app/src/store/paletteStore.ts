import { create } from "zustand";
import type { CopyFormat, SatMode } from "../types/palette";
import type { ColorFormat } from "../lib/colors";

interface PaletteState {
  hue: number;
  saturation: number;
  sMod: number;
  satMode: SatMode;
  lMin: number;
  lMax: number;
  copyFormat: CopyFormat;
  targetInput: string | null;
  targetFormat: ColorFormat | null;
  targetHue: number | null;
  targetSat: number | null;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setSMod: (sMod: number) => void;
  setSatMode: (mode: SatMode) => void;
  setLRange: (min: number, max: number) => void;
  setCopyFormat: (format: CopyFormat) => void;
  setTarget: (hue: number, saturation: number, input: string, format: ColorFormat) => void;
  clearTarget: () => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  hue: 220,
  saturation: 0.5,
  sMod: 70,
  satMode: "endpoint",
  lMin: 0,
  lMax: 100,
  copyFormat: "hex",
  targetInput: null,
  targetFormat: null,
  targetHue: null,
  targetSat: null,
  setHue: (hue) => set({ hue }),
  setSaturation: (saturation) => set({ saturation }),
  setSMod: (sMod) => set({ sMod }),
  setSatMode: (satMode) => set({ satMode }),
  setLRange: (lMin, lMax) => set({ lMin, lMax }),
  setCopyFormat: (copyFormat) => set({ copyFormat }),
  setTarget: (hue, saturation, input, format) =>
    set({
      hue,
      saturation,
      targetInput: input,
      targetFormat: format,
      targetHue: hue,
      targetSat: saturation,
    }),
  clearTarget: () =>
    set({
      targetInput: null,
      targetFormat: null,
      targetHue: null,
      targetSat: null,
    }),
}));
