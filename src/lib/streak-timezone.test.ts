import { afterEach, expect, it, vi } from "vitest";
import { getStreak } from "./stats";

const originalTZ = process.env.TZ;
afterEach(() => {
  process.env.TZ = originalTZ;
  vi.useRealTimers();
});

it("can produce streaks of 504 and 984 from the same events in different time zones", () => {
  vi.useFakeTimers({ now: new Date("2026-11-12T12:00:00Z") });
  const events = Array.from({ length: 984 }, (_, daysAgo) => {
    const date = new Date("2026-11-12T12:00:00Z");
    date.setUTCDate(date.getUTCDate() - daysAgo);
    if (daysAgo === 504) date.setTime(date.getTime() - 15 * 60 * 60 * 1000);
    return { readAt: date, bookId: "book", pagesRead: 1 };
  });
  process.env.TZ = "UTC";
  expect(getStreak(events).streak).toBe(504);
  process.env.TZ = "Europe/Moscow";
  expect(getStreak(events).streak).toBe(984);
});
