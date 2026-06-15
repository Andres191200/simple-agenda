/**
 * Core domain model for Simple Agenda.
 *
 * An activity is confined to a single day (no cross-midnight), which is what
 * keeps rendering simple — a bar never splits across rows. See design.md D3.
 */
export interface Activity {
  id: string;
  title: string;
  description: string;
  /** Hex color, e.g. "#3b82f6". */
  color: string;
  /** Calendar day, "YYYY-MM-DD". */
  day: string;
  /** Start time within the day, "HH:mm" (minute precision). */
  start: string;
  /** End time within the day, "HH:mm" (minute precision). */
  end: string;
}

/** Palette offered by the color swatch picker. */
export const ACTIVITY_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
] as const;
