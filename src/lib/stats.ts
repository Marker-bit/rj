import { ReadEvent } from "@prisma/client";
import { addDays, endOfWeek, isSameDay, startOfWeek, subDays } from "date-fns";

export const goodNumbers = [
  5, 10, 15, 20, 50, 100, 200, 365, 730, 1095, 1460, 1825, 2190, 2555, 2920,
];

export function getStreak(events: ReadEvent[]) {
  if (events.length === 0) {
    return { streak: 0, breakDay: new Date(), readToday: false };
  }
  let streak = 0;
  let day = new Date();
  day = subDays(day, 1);
  let breakDay: null | Date = null;

  while (true) {
    if (events.find((e) => isSameDay(e.readAt, day))) {
      streak++;
      day = subDays(day, 1);
    } else {
      let l = 50;
      while (!events.find((e) => isSameDay(e.readAt, day)) && l > 0) {
        day = subDays(day, 1);
        l--;
      }
      breakDay = day;
      break;
    }
  }

  let readToday = false;
  if (events.find((e) => isSameDay(e.readAt, new Date()))) {
    readToday = true;
    streak++;
  }

  return { streak, breakDay, readToday };
}

export function getDays(events: ReadEvent[]) {
  const now = new Date();
  const from = startOfWeek(now, { weekStartsOn: 1 });
  const to = endOfWeek(now, { weekStartsOn: 1 });
  let current = from;
  let currentDays = 0;
  let streak: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    streak[i] = 0;
  }
  while (current <= to) {
    const todayEvents = events.filter((e) => isSameDay(e.readAt, current));
    if (todayEvents.length) {
      let dayStreak = 0;
      for (let event of todayEvents) {
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
  let streak: Record<string, number> = {};
  let res = [];
  for (let i = 0; i < 7; i++) {
    streak[i] = 0;
  }
  while (current <= to) {
    const todayEvents = events.filter((e) => isSameDay(e.readAt, current));
    let dayStreak = 0;
    if (todayEvents.length) {
      for (let event of todayEvents) {
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
