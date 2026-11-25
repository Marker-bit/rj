import { expect, it } from "vitest";
import { getReadingStats } from "./stats";

it("can produce streaks of 504 and 984 from the same events in different time zones", () => {
  const now = new Date("2026-11-12T12:00:00Z");
  const events = Array.from({ length: 984 }, (_, daysAgo) => {
    const readAt = new Date(now);
    readAt.setUTCDate(readAt.getUTCDate() - daysAgo);
    if (daysAgo === 504) readAt.setTime(readAt.getTime() - 15 * 60 * 60 * 1000);
    return { readAt, bookId: "book", pagesRead: 1 };
  });

  expect(getReadingStats({ events, now, timeZone: "UTC" }).streak).toBe(504);
  expect(
    getReadingStats({ events, now, timeZone: "Europe/Moscow" }).streak,
  ).toBe(984);
});

it("keeps consecutive local days through a daylight saving transition", () => {
  const events = [
    { readAt: new Date("2026-03-08T04:30:00Z"), bookId: "book", pagesRead: 5 },
    { readAt: new Date("2026-03-09T03:30:00Z"), bookId: "book", pagesRead: 12 },
  ];
  const result = getReadingStats({
    events,
    now: new Date("2026-03-09T04:15:00Z"),
    timeZone: "America/New_York",
  });

  expect(result).toMatchObject({
    streak: 2,
    readToday: false,
    daysSinceLastRead: 1,
  });
  expect(
    result
      .recentDays()
      .slice(-3)
      .map((day) => day.pagesRead),
  ).toEqual([5, 7, 0]);
  expect(result.week()[0]).toMatchObject({ daysAgo: 0, pagesRead: 0 });
});
