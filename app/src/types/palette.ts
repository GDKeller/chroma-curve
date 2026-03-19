export type SatMode = "endpoint" | "target";

export interface PaletteParams {
  hue: number;
  saturation: number;
  sMod: number;
  satMode: SatMode;
  lMin: number;
  lMax: number;
}

export interface ColorEntry {
  label: string;
  lightness: number;
  hsl: [number, number, number];
  hslString: string;
  hex: string;
}

export type ExportFormat = "css" | "tw4" | "tw3" | "scss" | "js" | "json" | "gpl" | "text";

export type ColorSpace = "hsl" | "hex" | "rgb" | "hcl" | "oklch";
