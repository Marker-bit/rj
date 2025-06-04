import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
import { endOfDay, startOfDay } from "date-fns";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default async function UsersCountCard() {
  const now = new Date();
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
  });
  const allUsersCount = await db.user.count();

  return (
    <div className="flex rounded-xl border p-4 sm:col-span-6">
      <div className="flex flex-col">
        <div className="text-3xl font-bold">
          {usersToday.length}
          <span className="text-muted-foreground">/{allUsersCount}</span>
        </div>
        <p className="text-muted-foreground">
          пользователей сегодня зарегистрировалось
        </p>
      </div>
      <ScrollArea>
        <div className="flex flex-col gap-4 sm:flex-row">
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
  );
}
