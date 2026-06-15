/**
 * Activity validation. Rule: end must be strictly after start, both within the
 * same day. Cross-midnight is not expressible. See specs/activity-management.
 */
import { minutesFromMidnight } from "./time";

export interface ActivityDraft {
  title: string;
  day: string;
  start: string;
  end: string;
}

/**
 * Validate the time fields of an activity draft.
 * Returns an error message, or null if valid.
 */
export function validateTimes(start: string, end: string): string | null {
  const startMin = minutesFromMidnight(start);
  const endMin = minutesFromMidnight(end);
  if (Number.isNaN(startMin) || Number.isNaN(endMin)) {
    return "Start and end must be valid times.";
  }
  if (endMin <= startMin) {
    return "End time must be after start time.";
  }
  return null;
}

/**
 * Full draft validation (title required, valid same-day time range).
 * Returns an error message, or null if valid. Because start/end are times
 * within a single `day`, the same-day rule is structurally guaranteed.
 */
export function validateDraft(draft: ActivityDraft): string | null {
  if (!draft.title.trim()) {
    return "Title is required.";
  }
  if (!draft.day) {
    return "Day is required.";
  }
  return validateTimes(draft.start, draft.end);
}
