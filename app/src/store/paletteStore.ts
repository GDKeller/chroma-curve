import { create } from "zustand";

interface PaletteState {
  hue: number;
  saturation: number;
  sMod: number;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setSMod: (sMod: number) => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  hue: 200,
  saturation: 0.2,
  sMod: 70,
  setHue: (hue) => set({ hue }),
  setSaturation: (saturation) => set({ saturation }),
  setSMod: (sMod) => set({ sMod }),
}));
