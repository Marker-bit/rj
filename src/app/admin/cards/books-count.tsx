import { db } from "@/lib/db";
import { declOfNum } from "@/lib/utils";
import { endOfDay, startOfDay } from "date-fns";
import UserBooks from "./user-books";

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
      readEvents: true,
    },
  })
  const users = booksToday.slice(0, 5).map((book) => book.user)
  const uniqueUsers = users.filter(
    (value, index, self) => self.findIndex((v) => v.id === value.id) === index
  )
  const allBooksCount = await db.book.count()

  return (
    <div className="col-span-2 row-span-2 rounded-xl border p-4">
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
        <div className="flex flex-wrap gap-2">
          {uniqueUsers.length > 0 &&
            uniqueUsers.map((user) => (
              <UserBooks
                key={user.id}
                user={user}
                books={booksToday.filter((book) => book.user.id === user.id)}
              />
            ))}
        </div>
        {/* {booksToday.slice(0, 5).map((book) => (
          <div className="flex -space-x-2" key={book.id}>
            {book.coverUrl && (
              <Image
                src={book.coverUrl}
                alt="Book cover"
                width={256}
                height={256}
                className="z-10 h-32 w-auto rounded-xl shadow-xl"
              />
            )}
            <div className="mt-2 flex h-fit flex-col rounded-r-xl bg-zinc-100 p-2 pl-4">
              <div className="font-bold">{book.title}</div>
              <div className="text-sm text-muted-foreground">{book.author}</div>
              {book.groupBook && (
                <div className="text-sm text-muted-foreground">
                  {book.groupBook?.group.title}
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                {book.readEvents.length === 0 ? "Не начата" : "Начата"}
              </div>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  )
}
