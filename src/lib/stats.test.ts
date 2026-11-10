import type { ReadEvent } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getDays, getEventDays, getStreak } from "./stats";

const NOW = new Date(2026, 0, 14, 12, 0, 0); // Wednesday, 14 Jan 2026

function event(bookId: string, readAt: Date, pagesRead: number): ReadEvent {
  return {
    id: `${bookId}-${readAt.getTime()}-${pagesRead}`,
    bookId,
    readAt,
    pagesRead,
  };
}

function daysAgo(days: number, hours = 10): Date {
  const date = new Date(NOW);
  date.setDate(date.getDate() - days);
  date.setHours(hours, 0, 0, 0);
  return date;
}

describe("getStreak", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: NOW });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns an empty streak without events", () => {
    expect(getStreak([])).toEqual({
      streak: 0,
      breakDay: new Date(2026, 0, 14),
      readToday: false,
    });
  });

  it("counts a single event today", () => {
    const result = getStreak([event("book-1", daysAgo(0), 10)]);

    expect(result.streak).toBe(1);
    expect(result.readToday).toBe(true);
  });

  it("counts consecutive days ending today", () => {
    const result = getStreak([
      event("book-1", daysAgo(0), 10),
      event("book-1", daysAgo(1), 20),
    ]);

    expect(result.streak).toBe(2);
    expect(result.readToday).toBe(true);
  });

  it("stops the streak at a gap", () => {
    const result = getStreak([
      event("book-1", daysAgo(0), 10),
      event("book-1", daysAgo(2), 20),
    ]);

    expect(result.streak).toBe(1);
    expect(result.readToday).toBe(true);
  });
});

describe("getDays", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: NOW });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns seven numeric entries", () => {
    const days = getDays([]);
    const values = Object.values(days);

    expect(values).toHaveLength(7);
    for (const value of values) {
      expect(typeof value).toBe("number");
    }
  });

  it("counts pages read during the current week", () => {
    const days = getDays([event("book-1", daysAgo(0), 10)]);
    const total = Object.values(days).reduce((sum, value) => sum + value, 0);

    expect(total).toBe(10);
  });
});

describe("getEventDays", () => {
  it("counts the delta for repeated events of the same book on one day", () => {
    const readAt = daysAgo(0);
    const later = new Date(readAt);
    later.setHours(11, 0, 0, 0);

    const days = getEventDays([
      event("book-1", readAt, 5),
      event("book-1", later, 12),
    ]);

    expect(days).toHaveLength(1);
    expect(days[0].pagesRead).toBe(12);
  });
});
