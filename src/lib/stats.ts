import type { ReadEvent } from "@prisma/client";
import {
  addDays,
  addWeeks,
  endOfWeek,
  isSameDay,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";

export const goodNumbers = [
  5, 10, 15, 20, 50, 100, 200, 365, 730, 1095, 1460, 1825, 2190, 2555, 2920,
];

export function getStreak(events: ReadEvent[]) {
  const today = startOfDay(new Date());
  if (events.length === 0) {
    return { streak: 0, breakDay: today, readToday: false };
  }

  // The most recent day the user actually read, however long ago that was.
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

export function getEventDays(events: ReadEvent[]) {
  if (events.length === 0) {
    return [];
  }
  const startDay = events[0].readAt;
  const endDay = events[events.length - 1].readAt;
  let current = startDay;
  const res: Map<Date, number> = new Map();
  while (current <= endDay) {
    const todayEvents = events.filter((e) => isSameDay(e.readAt, current));
    let dayStreak = 0;
    if (todayEvents.length) {
      for (const event of todayEvents) {
        const bookEvents = events.filter((e) => e.bookId === event.bookId);
        if (bookEvents.length === 1 || bookEvents.indexOf(event) === 0) {
          dayStreak += event.pagesRead;
        } else {
          const previousEventIndex = bookEvents.indexOf(event) - 1;
          const previousEvent = bookEvents[previousEventIndex];
          dayStreak += event.pagesRead - previousEvent.pagesRead;
        }
      }
    }
    res.set(current, dayStreak);
    current = addDays(current, 1);
  }
  return res.entries().map
    ? Array.from(
        res.entries().map(([date, pagesRead]) => ({ date, pagesRead })),
      )
    : [];
}

export function getDays(events: ReadEvent[], weekPadding: number = 0) {
  const now = new Date();
  const from = startOfWeek(now, { weekStartsOn: 1 });
  const to = endOfWeek(now, { weekStartsOn: 1 });
  let current = addWeeks(from, weekPadding); // because weekPadding is a negative number
  let currentDays = 0;
  const streak: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    streak[i] = 0;
  }
  while (current <= to) {
    const todayEvents = events.filter((e) => isSameDay(e.readAt, current));
    if (todayEvents.length) {
      let dayStreak = 0;
      for (const event of todayEvents) {
        const bookEvents = events.filter((e) => e.bookId === event.bookId);
        if (bookEvents.length === 1 || bookEvents.indexOf(event) === 0) {
          dayStreak += event.pagesRead;
        } else {
          const previousEventIndex = bookEvents.indexOf(event) - 1;
          const previousEvent = bookEvents[previousEventIndex];
          dayStreak += event.pagesRead - previousEvent.pagesRead;
        }
      }
      streak[currentDays] = dayStreak;
    }
    current = addDays(current, 1);
    currentDays++;
  }

  return streak;
}

export function getDays2(events: ReadEvent[]) {
  const now = new Date();
  const from = subDays(now, 6);
  const to = now;
  let current = from;
  let currentDays = 0;
  const streak: Record<string, number> = {};
  const res = [];
  for (let i = 0; i < 7; i++) {
    streak[i] = 0;
  }
  while (current <= to) {
    const todayEvents = events.filter((e) => isSameDay(e.readAt, current));
    let dayStreak = 0;
    if (todayEvents.length) {
      for (const event of todayEvents) {
        const bookEvents = events.filter((e) => e.bookId === event.bookId);
        if (bookEvents.length === 1 || bookEvents.indexOf(event) === 0) {
          dayStreak += event.pagesRead;
        } else {
          const previousEventIndex = bookEvents.indexOf(event) - 1;
          const previousEvent = bookEvents[previousEventIndex];
          dayStreak += event.pagesRead - previousEvent.pagesRead;
        }
      }
      streak[currentDays] = dayStreak;
    }
    res.push({
      date: current,
      pagesRead: dayStreak,
    });
    current = addDays(current, 1);
    currentDays++;
  }

  return res;
}
