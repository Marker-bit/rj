import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
import { endOfDay, startOfDay } from "date-fns";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default async function Page() {
  const now = new Date()
  const usersToday = await db.user.findMany({
    where: {
      registeredAt: {
        gte: startOfDay(now),
        lte: endOfDay(now),
      },
    },
    include: {
      books: true,
    },
    take: 5,
  })
  const booksToday = await db.book.count({
    where: {
      createdAt: {
        gte: startOfDay(now),
        lte: endOfDay(now),
      },
    },
  })
  const allBooks = await db.book.count()

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">Управление</h1>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-5 flex rounded-xl border p-4">
          <div className="flex flex-col">
            <div className="text-xl font-bold">{usersToday.length}</div>
            <p className="text-muted-foreground">
              пользователей сегодня зарегистрировалось
            </p>
          </div>
          <ScrollArea>
            <div className="flex gap-4">
              {usersToday.map((user) => (
                <div
                  key={user.id}
                  className="flex w-44 flex-col items-center rounded-xl border p-4 text-center"
                >
                  <Image
                    src={user.avatarUrl ? user.avatarUrl : "/no-avatar.png"}
                    width={128}
                    height={128}
                    alt="avatar"
                    className="size-8 rounded-full"
                  />
                  <div className="font-semibold">{user.firstName}</div>
                  <div className="text-xs text-muted-foreground">
                    @{user.username}
                  </div>
                  <div className="flex gap-1 text-xs text-muted-foreground">
                    {user.books.length} книг <ChevronDown className="size-4" />
                  </div>
                </div>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="rounded-xl border p-4">
          <div className="flex flex-col">
            <div className="text-xl font-bold">{booksToday}</div>
            <p className="text-muted-foreground">книг сегодня добавлено</p>
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="flex flex-col">
            <div className="text-xl font-bold">{allBooks}</div>
            <p className="text-muted-foreground">всего книг</p>
          </div>
        </div>
        
      </div>
    </div>
  )
}
