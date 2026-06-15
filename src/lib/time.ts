/**
 * Time and date helpers. Times are wall-clock "HH:mm" strings within a single
 * day; dates are "YYYY-MM-DD" strings. See design.md D1/D3.
 */

const MINUTES_PER_DAY = 24 * 60;

/** Parse "HH:mm" into minutes from midnight. Returns NaN if malformed. */
export function minutesFromMidnight(time: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return NaN;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) return NaN;
  const total = hours * 60 + minutes;
  return total > MINUTES_PER_DAY ? NaN : total;
}

/** Fraction of the day (0..1) for an "HH:mm" time. */
export function dayFraction(time: string): number {
  const minutes = minutesFromMidnight(time);
  if (Number.isNaN(minutes)) return 0;
  return minutes / MINUTES_PER_DAY;
}

/** Fraction of the day (0..1) for a Date's local time-of-day. */
export function dayFractionFromDate(date: Date): number {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes / MINUTES_PER_DAY;
}

/** Format a Date as a local "YYYY-MM-DD" day key (no timezone shift). */
export function toDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse a "YYYY-MM-DD" day key into a local Date (midnight). */
export function fromDayKey(dayKey: string): Date {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Short label for a day key, e.g. "Mon 13". */
export function dayLabel(dayKey: string): string {
  const date = fromDayKey(dayKey);
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()}`;
}

/** Weekday name and day-of-month number for a day key, for a two-line label. */
export function dayParts(dayKey: string): { weekday: string; dayNum: number } {
  const date = fromDayKey(dayKey);
  return { weekday: WEEKDAYS[date.getDay()], dayNum: date.getDate() };
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Title for a month, e.g. "June 2026", from a {year, month0} pair. */
export function monthTitle(year: number, month0: number): string {
  return `${MONTH_NAMES[month0]} ${year}`;
}

/** All day keys for a given month (year, 0-based month), in order. */
export function daysInMonth(year: number, month0: number): string[] {
  const count = new Date(year, month0 + 1, 0).getDate();
  const keys: string[] = [];
  for (let day = 1; day <= count; day++) {
    keys.push(toDayKey(new Date(year, month0, day)));
  }
  return keys;
}
