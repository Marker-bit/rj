import { describe, expect, it } from "vitest";
import { getReadingStats, type StreakEvent } from "./stats";

const now = new Date("2026-01-14T12:00:00Z");

function event(
  readAt: string,
  pagesRead: number,
  bookId = "book",
): StreakEvent {
  return { readAt: new Date(readAt), bookId, pagesRead };
}

function stats(events: StreakEvent[]) {
  return getReadingStats({ events, timeZone: "UTC", now });
}

describe("reading stats", () => {
  it("returns an empty streak and a zero-filled week without events", () => {
    const result = stats([]);

    expect(result).toMatchObject({
      streak: 0,
      daysSinceLastRead: null,
      readToday: false,
    });
    expect(result.week().map((day) => day.pagesRead)).toEqual(Array(7).fill(0));
    expect(result.history()).toEqual([]);
  });

  it("keeps a streak alive through today and stops it at a gap", () => {
    const result = stats([
      event("2026-01-11T18:00:00Z", 5),
      event("2026-01-13T10:00:00Z", 15),
    ]);

    expect(result).toMatchObject({
      streak: 1,
      readToday: false,
      daysSinceLastRead: 1,
    });
  });

  it("uses the same page deltas in the streak, recent days, and week calendars", () => {
    const result = stats([
      event("2026-01-14T10:00:00Z", 15),
      event("2026-01-11T18:00:00Z", 5),
      event("2026-01-13T10:00:00Z", 15),
      event("2026-01-13T11:00:00Z", 2, "another-book"),
    ]);

    expect(result).toMatchObject({
      streak: 2,
      readToday: true,
      pagesReadToday: 0,
    });
    expect(result.recentDays().map((day) => day.pagesRead)).toEqual([
      0, 0, 0, 5, 0, 12, 0,
    ]);
    expect(result.week().map((day) => day.pagesRead)).toEqual([
      0, 12, 0, 0, 0, 0, 0,
    ]);
    expect(result.week(-1).map((day) => day.pagesRead)).toEqual([
      0, 0, 0, 0, 0, 0, 5,
    ]);
    expect(result.week()[2].daysAgo).toBe(0);
    expect(result.week(-1)[6].daysAgo).toBe(3);
    expect(result.history().map((day) => day.pagesRead)).toEqual([5, 0, 12, 0]);
  });

  it("includes both calendar days when the final event is earlier in the day", () => {
    const result = stats([
      event("2026-01-14T01:00:00Z", 12),
      event("2026-01-13T23:00:00Z", 5),
    ]);

    expect(result.history().map((day) => day.pagesRead)).toEqual([5, 7]);
  });
});
