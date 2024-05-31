import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { declOfNum } from "@/lib/utils"
import { endOfDay, startOfDay } from "date-fns"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import UserBooks from "./user-books"

export default async function BooksCountCard() {
  const now = new Date()
  const booksToday = await db.book.findMany({
    where: {
      createdAt: {
        gte: startOfDay(now),
        lte: endOfDay(now),
      },
    },
    include: {
      user: true,
      groupBook: {
        include: {
          group: true,
        },
      },
    },
  })
  const uniqueUsers = booksToday
    .slice(0, 5)
    .map((book) => book.user)
    .filter((value, index, self) => self.indexOf(value) === index)
  const allBooksCount = await db.book.count()

  return (
    <div className="rounded-xl border p-4">
      <div className="flex flex-col">
        <div className="text-3xl font-bold">
          {booksToday.length}
          <span className="text-muted-foreground">/{allBooksCount}</span>
        </div>
        <p className="text-muted-foreground">
          {declOfNum(booksToday.length, [
            "книга создана",
            "книги созданы",
            "книг создано",
          ])}{" "}
          сегодня
        </p>
        {uniqueUsers.length > 0 &&
          uniqueUsers.map((user) => (
            <UserBooks
              key={user.id}
              user={user}
              books={booksToday.filter((book) => book.user.id === user.id)}
            />
          ))}
      </div>
    </div>
  )
}
