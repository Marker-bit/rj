import type { ReadEvent } from "@prisma/client";
import {
  addDays,
  addWeeks,
  endOfWeek,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";

export type StreakEvent = Pick<ReadEvent, "readAt" | "bookId" | "pagesRead">;

export const goodNumbers = [
  5, 10, 15, 20, 50, 100, 200, 365, 730, 1095, 1460, 1825, 2190, 2555, 2920,
];

export function getStreak(events: StreakEvent[]) {
  const today = startOfDay(new Date());
  if (events.length === 0) {
    return { streak: 0, breakDay: today, readToday: false };
  }

  const lastReadDay = events.reduce(
    (latest, event) => (event.readAt > latest ? event.readAt : latest),
    events[0].readAt,
  );

  const readDays = new Set(
    events.map((event) => startOfDay(event.readAt).getTime()),
  );
  const readToday = readDays.has(today.getTime());

  let streak = 0;
  let day = readToday ? today : subDays(today, 1);
  while (readDays.has(day.getTime())) {
    streak++;
    day = subDays(day, 1);
  }

  return { streak, breakDay: startOfDay(lastReadDay), readToday };
}

/**
 * Pages read per local calendar day. Each book's events are ordered by
 * `readAt`, and only the increase in `pagesRead` is counted, so re-reading the
 * same pages on a later day does not add pages twice.
 */
function getPagesReadByDay(events: StreakEvent[]) {
  const byBook = new Map<string, StreakEvent[]>();
  for (const event of events) {
    const bookEvents = byBook.get(event.bookId);
    if (bookEvents) {
      bookEvents.push(event);
    } else {
      byBook.set(event.bookId, [event]);
    }
  }

  const pagesReadByDay = new Map<number, number>();
  for (const bookEvents of byBook.values()) {
    bookEvents.sort((a, b) => a.readAt.getTime() - b.readAt.getTime());
    let previousPages = 0;
    for (const [index, event] of bookEvents.entries()) {
      const pagesRead =
        index === 0
          ? event.pagesRead
          : Math.max(event.pagesRead - previousPages, 0);
      previousPages = event.pagesRead;
      const day = startOfDay(event.readAt).getTime();
      pagesReadByDay.set(day, (pagesReadByDay.get(day) ?? 0) + pagesRead);
    }
  }

  return pagesReadByDay;
}

export function getEventDays(events: StreakEvent[]) {
  if (events.length === 0) {
    return [];
  }
  const pagesReadByDay = getPagesReadByDay(events);
  const startDay = events[0].readAt;
  const endDay = events[events.length - 1].readAt;
  let current = startDay;
  const res: Map<Date, number> = new Map();
  while (current <= endDay) {
    res.set(current, pagesReadByDay.get(startOfDay(current).getTime()) ?? 0);
    current = addDays(current, 1);
  }
  return res.entries().map
    ? Array.from(
        res.entries().map(([date, pagesRead]) => ({ date, pagesRead })),
      )
    : [];
}

export function getDays(events: StreakEvent[], weekPadding: number = 0) {
  const now = new Date();
  const from = startOfWeek(now, { weekStartsOn: 1 });
  const to = endOfWeek(now, { weekStartsOn: 1 });
  const pagesReadByDay = getPagesReadByDay(events);
  let current = addWeeks(from, weekPadding); // because weekPadding is a negative number
  let currentDays = 0;
  const streak: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    streak[i] = 0;
  }
  while (current <= to) {
    const pagesRead = pagesReadByDay.get(startOfDay(current).getTime());
    if (pagesRead !== undefined) {
      streak[currentDays] = pagesRead;
    }
    current = addDays(current, 1);
    currentDays++;
  }

  return streak;
}

export function getDays2(events: StreakEvent[]) {
  const now = new Date();
  const from = subDays(now, 6);
  const to = now;
  const pagesReadByDay = getPagesReadByDay(events);
  let current = from;
  let currentDays = 0;
  const streak: Record<string, number> = {};
  const res = [];
  for (let i = 0; i < 7; i++) {
    streak[i] = 0;
  }
  while (current <= to) {
    const pagesRead = pagesReadByDay.get(startOfDay(current).getTime()) ?? 0;
    if (pagesRead) {
      streak[currentDays] = pagesRead;
    }
    res.push({
      date: current,
      pagesRead: pagesRead,
    });
    current = addDays(current, 1);
    currentDays++;
  }

  return res;
}
