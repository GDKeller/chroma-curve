import { create } from "zustand";
import type { CopyFormat, SatMode } from "../types/palette";

interface PaletteState {
  hue: number;
  saturation: number;
  sMod: number;
  satMode: SatMode;
  lMin: number;
  lMax: number;
  copyFormat: CopyFormat;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setSMod: (sMod: number) => void;
  setSatMode: (mode: SatMode) => void;
  setLRange: (min: number, max: number) => void;
  setCopyFormat: (format: CopyFormat) => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  hue: 220,
  saturation: 0.5,
  sMod: 70,
  satMode: "endpoint",
  lMin: 0,
  lMax: 100,
  copyFormat: "hex",
  setHue: (hue) => set({ hue }),
  setSaturation: (saturation) => set({ saturation }),
  setSMod: (sMod) => set({ sMod }),
  setSatMode: (satMode) => set({ satMode }),
  setLRange: (lMin, lMax) => set({ lMin, lMax }),
  setCopyFormat: (copyFormat) => set({ copyFormat }),
}));
