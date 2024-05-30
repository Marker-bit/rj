import { db } from "@/lib/db"
import { declOfNum } from "@/lib/utils";
import { endOfDay, startOfDay } from "date-fns"

export default async function BooksCountCard() {
  const now = new Date()
  const booksToday = await db.book.count({
    where: {
      createdAt: {
        gte: startOfDay(now),
        lte: endOfDay(now),
      },
    },
  })
  const allBooksCount = await db.book.count()

  return (
    <div className="rounded-xl border p-4">
      <div className="flex flex-col">
        <div className="text-3xl font-bold">
          {booksToday}
          <span className="text-muted-foreground">/{allBooksCount}</span>
        </div>
        <p className="text-muted-foreground">
          {declOfNum(booksToday, [
            "книга создана",
            "книги созданы",
            "книг создано",
          ])}{" "}
          сегодня
        </p>
      </div>
    </div>
  )
}
