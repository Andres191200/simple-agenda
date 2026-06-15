/**
 * Greedy interval packing for overlapping activities within a single day.
 *
 * Sort by start time; assign each activity the lowest sub-row index whose
 * last-placed activity has already ended (end <= start). Sub-rows are reused
 * once freed, so packing stays compact. Pure and testable. See design.md D2.
 */
import type { Activity } from "../types";
import { minutesFromMidnight } from "./time";

export interface PackedActivity {
  activity: Activity;
  /** Zero-based sub-row index within the day-row. */
  subRow: number;
}

export interface PackedDay {
  items: PackedActivity[];
  /** Number of sub-rows needed to render without overlap (>= 1 when non-empty). */
  subRowCount: number;
}

export function packDay(activities: Activity[]): PackedDay {
  const sorted = [...activities].sort((a, b) => {
    const byStart = minutesFromMidnight(a.start) - minutesFromMidnight(b.start);
    if (byStart !== 0) return byStart;
    return minutesFromMidnight(a.end) - minutesFromMidnight(b.end);
  });

  // subRowEnds[i] = end minute of the last activity placed on sub-row i.
  const subRowEnds: number[] = [];
  const items: PackedActivity[] = [];

  for (const activity of sorted) {
    const start = minutesFromMidnight(activity.start);
    const end = minutesFromMidnight(activity.end);

    let subRow = subRowEnds.findIndex((rowEnd) => rowEnd <= start);
    if (subRow === -1) {
      subRow = subRowEnds.length;
      subRowEnds.push(end);
    } else {
      subRowEnds[subRow] = end;
    }
    items.push({ activity, subRow });
  }

  return { items, subRowCount: subRowEnds.length };
}
