export interface PaletteParams {
  hue: number;
  saturation: number;
  sMod: number;
}

export interface ColorEntry {
  label: string;
  lightness: number;
  hsl: [number, number, number];
  hslString: string;
  hex: string;
}

export type ExportFormat = "css" | "tw4" | "tw3" | "json" | "text";

export type ColorSpace = "hsl" | "hex" | "rgb" | "hcl" | "oklch";
