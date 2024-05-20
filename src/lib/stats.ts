import { ReadEvent } from "@prisma/client"
import { addDays, endOfWeek, isSameDay, startOfWeek, subDays } from "date-fns"

export function getStreak(events: ReadEvent[]) {
  let streak = 0
  let day = new Date()
  // day = subDays(day, 1)

  while (true) {
    if (events.find((e) => isSameDay(e.readAt, day))) {
      streak++
      day = subDays(day, 1)
    } else {
      break
    }
  }

  // if (events.find((e) => isSameDay(e.readAt, new Date()))) {
  //   streak++
  // }

  return streak
}

export function getDays(events: ReadEvent[]) {
  const now = new Date()
  const from = startOfWeek(now, { weekStartsOn: 1 })
  const to = endOfWeek(now, { weekStartsOn: 1 })
  let current = from
  let currentDays = 0
  let streak: Record<string, number> = {}
  for (let i = 0; i < 7; i++) {
    streak[i] = 0
  }
  while (current <= to) {
    const todayEvents = events.filter((e) => isSameDay(e.readAt, current))
    if (todayEvents.length) {
      streak[currentDays] += todayEvents.reduce(
        (sum, e) => sum + e.pagesRead,
        0
      )
    }
    current = addDays(current, 1)
    currentDays++
  }

  return streak
}
