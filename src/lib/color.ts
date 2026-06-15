/**
 * Color helpers for activity bars. Converts a hex color to HSL so we can build
 * a left-to-right gradient ending at the same hue with subtly higher lightness.
 */

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

/** Parse a #rgb or #rrggbb hex string into HSL (h: 0–360, s/l: 0–100). */
export function hexToHsl(hex: string): Hsl {
  let c = hex.replace("#", "").trim();
  if (c.length === 3) {
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** Return an `hsl(...)` string for `hex` with lightness raised by `deltaL`. */
export function lighten(hex: string, deltaL: number): string {
  const { h, s, l } = hexToHsl(hex);
  const nextL = Math.min(100, l + deltaL);
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${nextL.toFixed(1)}%)`;
}

/** Left-to-right gradient from the base color to a subtly lighter variant. */
export function barGradient(hex: string): string {
  return `linear-gradient(90deg, ${hex} 0%, ${lighten(hex, 10)} 100%)`;
}
