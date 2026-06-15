import { describe, it, expect, beforeEach } from "vitest";
import { loadActivities, saveActivities } from "./storage";
import type { Activity } from "../types";

const STORAGE_KEY = "simple-agenda:v1:activities";

const sample: Activity = {
  id: "1",
  title: "Standup",
  description: "daily",
  color: "#3b82f6",
  day: "2026-06-13",
  start: "09:00",
  end: "09:30",
};

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips activities", () => {
    saveActivities([sample]);
    expect(loadActivities()).toEqual([sample]);
  });

  it("returns an empty list when nothing is stored", () => {
    expect(loadActivities()).toEqual([]);
  });

  it("falls back to empty on corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadActivities()).toEqual([]);
  });

  it("drops malformed entries", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([sample, { id: "x" }, 42, null]),
    );
    expect(loadActivities()).toEqual([sample]);
  });

  it("ignores a non-array payload", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: "bar" }));
    expect(loadActivities()).toEqual([]);
  });
});
