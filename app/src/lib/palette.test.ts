import { test } from "node:test";
import assert from "node:assert/strict";
import { generateNeutrals } from "./palette.ts";
import type { PaletteParams } from "../types/palette.ts";

const params: PaletteParams = {
  hue: 220,
  saturation: 0.5,
  sMod: 70,
  satMode: "endpoint",
  lMin: 0,
  lMax: 100,
};
const lightness = (count?: number) =>
  generateNeutrals(params, count).map((e) => e.lightness);

test("swatch steps are evenly spaced to 0.1 L", () => {
  assert.deepEqual(lightness(9), [100, 87.5, 75, 62.5, 50, 37.5, 25, 12.5, 0]);
  assert.deepEqual(lightness(8), [100, 85.7, 71.4, 57.1, 42.9, 28.6, 14.3, 0]);
  assert.equal(generateNeutrals(params, 9)[7].hslString, "220 42.2% 12.5%");
});

test("no count, or one reaching the integer steps, gives every integer L", () => {
  assert.equal(lightness().length, 101);
  assert.deepEqual(lightness(101), lightness());
});
