import { describe, it, expect } from "vitest";
import { hexToHsl, lighten, barGradient } from "./color";

describe("hexToHsl", () => {
  it("parses primary blue", () => {
    const { h, s, l } = hexToHsl("#3b82f6");
    expect(Math.round(h)).toBe(217);
    expect(Math.round(s)).toBe(91);
    expect(Math.round(l)).toBe(60);
  });

  it("handles shorthand and black/white", () => {
    expect(hexToHsl("#000").l).toBe(0);
    expect(hexToHsl("#fff").l).toBe(100);
  });
});

describe("lighten", () => {
  it("raises lightness and clamps at 100", () => {
    const { l: baseL } = hexToHsl("#3b82f6");
    const out = lighten("#3b82f6", 10);
    const match = /hsl\([^ ]+ [^ ]+% ([\d.]+)%\)/.exec(out);
    expect(Number(match![1])).toBeCloseTo(baseL + 10, 1);
    expect(lighten("#ffffff", 20)).toContain("100.0%");
  });
});

describe("barGradient", () => {
  it("builds a left-to-right gradient from base to lighter", () => {
    const g = barGradient("#3b82f6");
    expect(g.startsWith("linear-gradient(90deg, #3b82f6 0%,")).toBe(true);
    expect(g).toContain("hsl(");
  });
});
