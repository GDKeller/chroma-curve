import { test } from "node:test";
import assert from "node:assert/strict";
import { formatTargetColor, parseTargetColor } from "./colors.ts";

test("oklch parses with and without slash-alpha", () => {
  const base = { hue: 201, saturation: 0.879, format: "oklch" };
  assert.deepEqual(parseTargetColor("oklch(70% 0.15 240)"), base);
  assert.deepEqual(parseTargetColor("oklch(0.7 0.15 240)"), base);
  assert.deepEqual(parseTargetColor("oklch(70% 0.15 240 / 50%)"), base);
  assert.deepEqual(parseTargetColor("oklch(0.7 0.15 240/0.5)"), base);
  assert.deepEqual(parseTargetColor("OKLCH(70% 0.15 240)"), base);
});

test("achromatic oklch has zero saturation", () => {
  assert.deepEqual(parseTargetColor("oklch(1 0 0)"), {
    hue: 0,
    saturation: 0,
    format: "oklch",
  });
});

test("malformed input is rejected", () => {
  assert.equal(parseTargetColor("oklch(0.7 0.15 240 / )"), null);
  assert.equal(parseTargetColor("oklch(0.7 0.15)"), null);
  assert.equal(parseTargetColor("nope"), null);
  assert.equal(parseTargetColor("  "), null);
});

test("hsl/rgb output is spaced and round-trips", () => {
  assert.equal(formatTargetColor(180, 0.5, "hsl"), "hsl(180, 50%, 50%)");
  assert.equal(formatTargetColor(180, 0.5, "rgb"), "rgb(64, 191, 191)");
  // rgb() is 8-bit, so 50% comes back as its true 49.8%
  for (const [format, saturation] of [
    ["hsl", 0.5],
    ["rgb", 0.498],
  ] as const) {
    assert.deepEqual(parseTargetColor(formatTargetColor(180, 0.5, format)), {
      hue: 180,
      saturation,
      format,
    });
  }
  assert.deepEqual(parseTargetColor("RGB(64, 191, 191)"), {
    hue: 180,
    saturation: 0.498,
    format: "rgb",
  });
});

test("typed hsl saturation keeps one decimal", () => {
  const expected = { hue: 220, saturation: 0.418, format: "hsl" };
  assert.deepEqual(parseTargetColor("hsl(220 41.8% 10%)"), expected);
  assert.deepEqual(parseTargetColor("hsl(220deg 41.8% 50% / 0.5)"), expected);
  assert.deepEqual(parseTargetColor("hsla(220, 41.8%, 50%, 0.5)"), expected);
  assert.equal(formatTargetColor(220, 0.418, "hsl"), "hsl(220, 41.8%, 50%)");
});

test("typed hsl hue survives low saturation", () => {
  // Read through chroma's 8-bit RGB, these came back as 216 and 0
  assert.equal(parseTargetColor("hsl(220 2% 50%)")?.hue, 220);
  assert.equal(parseTargetColor("hsl(220 0% 50%)")?.hue, 220);
  for (let h = 0; h < 360; h++) {
    assert.equal(parseTargetColor(`hsl(${h}deg 2% 10%)`)?.hue, h);
  }
  assert.equal(parseTargetColor("hsla(-140, 2%, 10%, 0.5)")?.hue, 220);
  assert.equal(parseTargetColor("hsl(580 2% 10%)")?.hue, 220);
  assert.equal(parseTargetColor("hsl(none 50% 50%)")?.hue, 0);
});
