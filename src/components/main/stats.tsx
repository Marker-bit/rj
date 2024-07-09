import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { BarChart } from "lucide-react"
import MainChart from "./main-chart"
import { addDays, isSameDay, subMonths } from "date-fns"

export async function Stats() {
  const { user } = await validateRequest()
  if (!user) return
  const profile = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      follower: true,
      following: true,
    },
  })
  const events = await db.readEvent.findMany({
    where: {
      book: {
        userId: user.id,
      },
    },
    include: {
      book: true,
    },
    orderBy: {
      readAt: "asc",
    },
  })
  const threeMonthsAgo = subMonths(new Date(), 3)
  const threeMonthsEvents = events.filter((event) => {
    return event.readAt > threeMonthsAgo
  })
  const chartData = []
  let day = threeMonthsAgo
  while (day <= new Date()) {
    let result = 0
    const todayEvents = threeMonthsEvents.filter((e) => {
      return isSameDay(e.readAt, day)
    })
    todayEvents.forEach((event) => {
      const bookEvents = threeMonthsEvents.filter((e) => {
        return event.bookId === e.book.id
      })
      if (bookEvents.length === 1 || bookEvents.indexOf(event) === 0) {
        result += event.pagesRead
      } else {
        const previousEventIndex = bookEvents.indexOf(event) - 1
        const previousEvent = bookEvents[previousEventIndex]
        result += event.pagesRead - previousEvent.pagesRead
      }
    })
    chartData.push({
      date: day.toISOString().split("T")[0],
      desktop: result,
    })
    day = addDays(day, 1)
  }
  return <MainChart chartData={chartData} />
}
