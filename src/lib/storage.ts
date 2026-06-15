/**
 * localStorage persistence for activities. One JSON blob under a versioned key.
 * Reads are defensive: missing or malformed data falls back to an empty list
 * rather than crashing. See design.md D6 and specs/local-persistence.
 */
import type { Activity } from "../types";

const STORAGE_KEY = "simple-agenda:v1:activities";

function isActivity(value: unknown): value is Activity {
  if (typeof value !== "object" || value === null) return false;
  const a = value as Record<string, unknown>;
  return (
    typeof a.id === "string" &&
    typeof a.title === "string" &&
    typeof a.description === "string" &&
    typeof a.color === "string" &&
    typeof a.day === "string" &&
    typeof a.start === "string" &&
    typeof a.end === "string"
  );
}

/** Load activities from localStorage; returns [] on missing/corrupt data. */
export function loadActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isActivity);
  } catch {
    return [];
  }
}

/** Persist activities to localStorage. Swallows quota/availability errors. */
export function saveActivities(activities: Activity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch {
    // Storage unavailable or over quota — nothing actionable in v1.
  }
}
