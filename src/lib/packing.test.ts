import { describe, it, expect } from "vitest";
import { packDay } from "./packing";
import type { Activity } from "../types";

function act(id: string, start: string, end: string): Activity {
  return { id, title: id, description: "", color: "#000", day: "2026-06-13", start, end };
}

describe("packDay", () => {
  it("places non-overlapping activities on the same sub-row (reuse)", () => {
    const { items, subRowCount } = packDay([
      act("A", "08:00", "10:00"),
      act("C", "12:00", "13:00"),
    ]);
    expect(subRowCount).toBe(1);
    expect(items.every((i) => i.subRow === 0)).toBe(true);
  });

  it("stacks overlapping activities onto separate sub-rows", () => {
    const { items, subRowCount } = packDay([
      act("A", "08:00", "10:00"),
      act("B", "09:00", "11:00"),
    ]);
    expect(subRowCount).toBe(2);
    const byId = Object.fromEntries(items.map((i) => [i.activity.id, i.subRow]));
    expect(byId.A).toBe(0);
    expect(byId.B).toBe(1);
  });

  it("reuses a freed sub-row after an earlier activity ends", () => {
    // A[08-10], B[09-11] -> A row0, B row1; C[10-12] can reuse row0 (A ended).
    const { items, subRowCount } = packDay([
      act("A", "08:00", "10:00"),
      act("B", "09:00", "11:00"),
      act("C", "10:00", "12:00"),
    ]);
    expect(subRowCount).toBe(2);
    const byId = Object.fromEntries(items.map((i) => [i.activity.id, i.subRow]));
    expect(byId.C).toBe(0);
  });

  it("handles identical times deterministically", () => {
    const { subRowCount } = packDay([
      act("A", "09:00", "10:00"),
      act("B", "09:00", "10:00"),
    ]);
    expect(subRowCount).toBe(2);
  });

  it("treats a zero-duration activity as ending at its start", () => {
    // point at 09:00 then a real block 09:00-10:00 -> can share a row.
    const { subRowCount } = packDay([
      act("P", "09:00", "09:00"),
      act("Q", "09:00", "10:00"),
    ]);
    expect(subRowCount).toBe(1);
  });

  it("returns an empty pack for no activities", () => {
    expect(packDay([])).toEqual({ items: [], subRowCount: 0 });
  });
});
