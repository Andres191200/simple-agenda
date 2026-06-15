import { describe, it, expect } from "vitest";
import { validateTimes, validateDraft } from "./validation";

describe("validateTimes", () => {
  it("accepts end after start", () => {
    expect(validateTimes("09:00", "10:00")).toBeNull();
  });

  it("rejects end equal to start", () => {
    expect(validateTimes("09:00", "09:00")).toMatch(/after start/);
  });

  it("rejects end before start", () => {
    expect(validateTimes("10:00", "09:00")).toMatch(/after start/);
  });

  it("rejects malformed times", () => {
    expect(validateTimes("nope", "10:00")).toMatch(/valid times/);
  });
});

describe("validateDraft", () => {
  const base = { title: "Standup", day: "2026-06-13", start: "09:00", end: "10:00" };

  it("accepts a valid draft", () => {
    expect(validateDraft(base)).toBeNull();
  });

  it("requires a title", () => {
    expect(validateDraft({ ...base, title: "  " })).toMatch(/Title/);
  });

  it("requires a day", () => {
    expect(validateDraft({ ...base, day: "" })).toMatch(/Day/);
  });

  it("enforces the time range", () => {
    expect(validateDraft({ ...base, end: "08:00" })).toMatch(/after start/);
  });
});
