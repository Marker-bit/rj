import { TZDate } from "@date-fns/tz";
import type { ReadEvent } from "@/generated/prisma/client";

export type StreakEvent = Pick<ReadEvent, "readAt" | "bookId" | "pagesRead">;

const DAY_MS = 86_400_000;

// Encode the local calendar date as a day number so adjacent days always
// differ by one, including across daylight saving changes.
function calendarDay(date: Date, timeZone: string) {
  const local = new TZDate(date, timeZone);
  return (
    Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()) / DAY_MS
  );
}

export function getReadingStats({
  events,
  timeZone,
  now,
}: {
  events: readonly StreakEvent[];
  timeZone: string;
  now: Date;
}) {
  const today = calendarDay(now, timeZone);
  const pagesByDay = new Map<number, number>();
  const previousPagesByBook = new Map<string, number>();
  let firstDay = Infinity;
  let lastDay = -Infinity;

  for (const event of [...events].sort(
    (a, b) => new Date(a.readAt).getTime() - new Date(b.readAt).getTime(),
  )) {
    const day = calendarDay(new Date(event.readAt), timeZone);
    const previousPages = previousPagesByBook.get(event.bookId) ?? 0;
    const pagesRead = Math.max(event.pagesRead - previousPages, 0);
    previousPagesByBook.set(event.bookId, event.pagesRead);
    pagesByDay.set(day, (pagesByDay.get(day) ?? 0) + pagesRead);
    firstDay = Math.min(firstDay, day);
    lastDay = Math.max(lastDay, day);
  }

  const readToday = pagesByDay.has(today);
  let streak = 0;
  for (let day = readToday ? today : today - 1; pagesByDay.has(day); day--) {
    streak++;
  }

  function daysFrom(first: number, length: number) {
    return Array.from({ length }, (_, offset) => {
      const day = first + offset;
      const utcDate = new Date(day * DAY_MS);
      return {
        date: new TZDate(
          utcDate.getUTCFullYear(),
          utcDate.getUTCMonth(),
          utcDate.getUTCDate(),
          timeZone,
        ),
        pagesRead: pagesByDay.get(day) ?? 0,
        daysAgo: today - day,
      };
    });
  }

  return {
    streak,
    readToday,
    pagesReadToday: pagesByDay.get(today) ?? 0,
    daysSinceLastRead: pagesByDay.size ? today - lastDay : null,
    recentDays: () => daysFrom(today - 6, 7),
    week: (offset = 0) => {
      const weekday = new Date(today * DAY_MS).getUTCDay();
      const monday = today - ((weekday + 6) % 7);
      return daysFrom(monday + offset * 7, 7);
    },
    history: () =>
      pagesByDay.size ? daysFrom(firstDay, lastDay - firstDay + 1) : [],
  };
}
