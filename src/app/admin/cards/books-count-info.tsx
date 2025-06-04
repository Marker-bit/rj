import { db } from "@/lib/db";
import {
  addDays,
  endOfMonth,
  isAfter,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import BooksCountChart from "./books-count-chart";

export default async function BooksCountInfo() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const books = await db.book.findMany({
    where: {
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });
  const users = await db.user.findMany({
    where: {
      registeredAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });
  const days: { date: Date; usersCount: number; booksCount: number }[] = [];
  for (let i = monthStart; i <= monthEnd; i = addDays(i, 1)) {
    if (isAfter(i, now)) break;
    days.push({ date: i, usersCount: 0, booksCount: 0 });
  }
  books.forEach((book) => {
    const date = new Date(book.createdAt);
    const index = days.findIndex((d) => isSameDay(d.date, date));
    if (index !== -1) {
      days[index].booksCount += 1;
    }
  });
  users.forEach((user) => {
    const date = new Date(user.registeredAt);
    const index = days.findIndex((d) => isSameDay(d.date, date));
    if (index !== -1) {
      days[index].usersCount += 1;
    }
  });
  return (
    <div className="col-span-3 rounded-xl border p-4">
      <Link
        className="group mb-2 flex w-fit items-center gap-2 font-bold"
        href="/admin/stats"
      >
        Книги и пользователи за месяц
        <ChevronRight
          className="size-4 transition-transform group-hover:translate-x-1"
          strokeWidth={3}
        />
      </Link>
      <BooksCountChart data={days} />
    </div>
  );
}
