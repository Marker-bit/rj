import { ReadEvent } from "@prisma/client";
import { isSameDay, subDays } from "date-fns";

export function getStreak(events: ReadEvent[]) {
  let streak = 0;
  let day = new Date();
  day = subDays(day, 1);

  while (true) {
    if (events.find((e) => isSameDay(e.readAt, day))) {
      streak++;
      day = subDays(day, 1);
    } else {
      break;
    }
  }

  return streak;
}
