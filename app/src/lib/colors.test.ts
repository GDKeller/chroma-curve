import { test } from "node:test";
import assert from "node:assert/strict";
import { formatTargetColor, parseTargetColor } from "./colors.ts";

test("oklch parses with and without slash-alpha", () => {
  const base = { hue: 201, saturation: 0.88, format: "oklch" };
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
  for (const format of ["hsl", "rgb"] as const) {
    assert.deepEqual(parseTargetColor(formatTargetColor(180, 0.5, format)), {
      hue: 180,
      saturation: 0.5,
      format,
    });
  }
  assert.deepEqual(parseTargetColor("RGB(64, 191, 191)"), {
    hue: 180,
    saturation: 0.5,
    format: "rgb",
  });
});
