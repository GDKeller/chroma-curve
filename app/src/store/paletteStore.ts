import { create } from "zustand";

interface PaletteState {
  hue: number;
  saturation: number;
  sMod: number;
  lMin: number;
  lMax: number;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setSMod: (sMod: number) => void;
  setLRange: (min: number, max: number) => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  hue: 220,
  saturation: 0.5,
  sMod: 70,
  lMin: 0,
  lMax: 100,
  setHue: (hue) => set({ hue }),
  setSaturation: (saturation) => set({ saturation }),
  setSMod: (sMod) => set({ sMod }),
  setLRange: (lMin, lMax) => set({ lMin, lMax }),
}));
