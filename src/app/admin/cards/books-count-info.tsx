import { db } from "@/lib/db"
import BooksCountChart from "./books-count-chart"
import { addDays, endOfMonth, isAfter, isSameDay, startOfMonth } from "date-fns"

export default async function BooksCountInfo() {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const books = await db.book.findMany({
    where: {
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  })
  const days: { date: Date; count: number }[] = []
  for (let i = monthStart; i <= monthEnd; i = addDays(i, 1)) {
    if (isAfter(i, now)) break
    days.push({ date: i, count: 0 })
  }
  books.forEach((book) => {
    const date = new Date(book.createdAt)
    const index = days.findIndex((d) => isSameDay(d.date, date))
    if (index !== -1) {
      days[index].count += 1
    }
  })
  return (
    <div className="col-span-3 rounded-xl border p-4">
      <div className="mb-2 font-bold">Книги за месяц</div>
      <BooksCountChart data={days} />
    </div>
  )
}
