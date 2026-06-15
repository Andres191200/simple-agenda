import { describe, it, expect } from "vitest";
import {
  minutesFromMidnight,
  dayFraction,
  toDayKey,
  dayLabel,
  daysInMonth,
  monthTitle,
} from "./time";

describe("minutesFromMidnight", () => {
  it("parses valid times", () => {
    expect(minutesFromMidnight("00:00")).toBe(0);
    expect(minutesFromMidnight("09:30")).toBe(570);
    expect(minutesFromMidnight("24:00")).toBe(1440);
  });

  it("rejects malformed and out-of-range times", () => {
    expect(minutesFromMidnight("9:5")).toBeNaN();
    expect(minutesFromMidnight("25:00")).toBeNaN();
    expect(minutesFromMidnight("10:60")).toBeNaN();
    expect(minutesFromMidnight("abc")).toBeNaN();
  });
});

describe("dayFraction", () => {
  it("maps midnight and noon", () => {
    expect(dayFraction("00:00")).toBe(0);
    expect(dayFraction("12:00")).toBe(0.5);
    expect(dayFraction("24:00")).toBe(1);
  });
});

describe("date helpers", () => {
  it("formats day keys without timezone shift", () => {
    expect(toDayKey(new Date(2026, 5, 13))).toBe("2026-06-13");
  });

  it("labels a day", () => {
    expect(dayLabel("2026-06-13")).toBe("Sat 13");
  });

  it("titles a month (0-based)", () => {
    expect(monthTitle(2026, 5)).toBe("June 2026");
  });

  it("lists all days in a month", () => {
    const days = daysInMonth(2026, 5); // June has 30 days
    expect(days).toHaveLength(30);
    expect(days[0]).toBe("2026-06-01");
    expect(days[29]).toBe("2026-06-30");
  });

  it("handles February in a non-leap year", () => {
    expect(daysInMonth(2026, 1)).toHaveLength(28);
  });
});
