import type { ReadEvent } from "@/generated/prisma/client";
import {
  addHours,
  differenceInDays,
  differenceInMinutes,
  endOfISOWeek,
  getDay,
  max,
  startOfISOWeek,
} from "date-fns";
import {
  BookCheck,
  BookOpen,
  CalendarRange,
  Users2,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getStreak } from "@/lib/stats";

function StatRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
  href?: string;
}) {
  const row = (
    <>
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <span className="flex-1">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </>
  );
  const className = "flex min-h-10 items-center gap-3 px-4 py-2 text-sm";

  return (
    <li>
      {href ? (
        <Link
          href={href}
          className={`${className} transition-colors hover:bg-muted focus-visible:bg-muted`}
        >
          {row}
        </Link>
      ) : (
        <div className={className}>{row}</div>
      )}
    </li>
  );
}

export function Stats({
  subscriptionCount,
  followerCount,
  events,
  books,
  subscriptionHref,
  followerHref,
}: {
  subscriptionCount?: number;
  followerCount?: number;
  events: (ReadEvent & {
    book: {
      id: string;
      title: string;
      author: string;
      pages: number;
      description: string;
      coverUrl: string | null;
      userId: string;
    };
  })[];
  books: {
    id: string;
    readEvents: {
      pagesRead: number;
    }[];
    pages: number;
  }[];
  subscriptionHref?: string;
  followerHref?: string;
}) {
  const startAndEndOfWeek = () => {
    const monday = startOfISOWeek(new Date());
    const sunday = endOfISOWeek(new Date());
    return [monday, sunday];
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [startOfWeek, _] = startAndEndOfWeek();

  const booksStats: Record<string, Record<string, number>> = {};
  const booksStatsNum: Record<string, number> = {};
  const readWeek: Record<string, number> = {};
  let readWeekSum = 0;
  const currentWeek: Record<string, Record<string, number>> = {};
  const currentWeekNum: Record<string, number> = {};
  const { streak } = getStreak(events);
  const readSpeed = [];
  const readBooks = books.filter((book) =>
    book.readEvents.find((event) => event.pagesRead >= book.pages),
  );

  if (events) {
    // events?.reverse();
    for (const event of events) {
      const eventDate = new Date(event.readAt);
      if (!currentWeek[event.bookId]) {
        currentWeek[event.bookId] = {};
      }
      const currentBook = events.filter(
        (evt: any) => evt.bookId === event.bookId,
      );
      const beforeEventIndex = currentBook.indexOf(event) - 1;
      const beforeEvent = currentBook[beforeEventIndex];
      const day = getDay(eventDate).toString();
      if (beforeEvent) {
        let beforeEventDate = new Date(beforeEvent.readAt);
        if (differenceInDays(eventDate, beforeEventDate) >= 1) {
          beforeEventDate = max([addHours(eventDate, -5), beforeEventDate]);
        }
        const minuteDifference = differenceInMinutes(
          eventDate,
          beforeEventDate,
        );
        const pageDifference = event.pagesRead - (beforeEvent?.pagesRead ?? 0);
        readSpeed.push(pageDifference / minuteDifference);
      }
      if (eventDate >= startOfWeek) {
        if (event.pagesRead > (currentWeek[event.bookId][day] ?? 0)) {
          const currentWeekBook = events.filter(
            (evt: any) => evt.bookId === event.bookId,
          );
          const beforeWeekEventIndex = currentWeekBook.indexOf(event) - 1;
          const beforeEventPages =
            currentWeekBook[beforeWeekEventIndex]?.pagesRead ?? 0;
          if (!currentWeek[event.bookId][day]) {
            currentWeek[event.bookId][day] = 0;
          }
          currentWeek[event.bookId][day] += event.pagesRead - beforeEventPages;
        }

        if (!readWeek[event.bookId]) {
          readWeek[event.bookId] = 0;
        }
        if (event.pagesRead > readWeek[event.bookId]) {
          readWeek[event.bookId] = event.pagesRead;
        }
      }

      if (!booksStats[event.bookId]) {
        booksStats[event.bookId] = {}; // date.getDay().toString()
      }
      if (event.pagesRead > (booksStats[event.bookId][day] ?? 0)) {
        const currentStatsBook = events.filter(
          (evt: any) => evt.bookId === event.bookId,
        );
        const beforeStatsEventIndex = currentStatsBook.indexOf(event) - 1;
        const beforeEventPages =
          currentStatsBook[beforeStatsEventIndex]?.pagesRead ?? 0;
        if (!booksStats[event.bookId][day]) {
          booksStats[event.bookId][day] = 0;
        }
        booksStats[event.bookId][day] += event.pagesRead - beforeEventPages;
      }
    }
  }

  for (const days of Object.values(booksStats)) {
    for (const [day, num] of Object.entries(days)) {
      if (!booksStatsNum[day]) {
        booksStatsNum[day] = 0;
      }
      booksStatsNum[day] += num;
    }
  }

  for (const days of Object.values(currentWeek)) {
    for (const [day, num] of Object.entries(days)) {
      if (!currentWeekNum[day]) {
        currentWeekNum[day] = 0;
      }
      currentWeekNum[day] += num;
    }
  }

  for (const n of Object.values(currentWeekNum)) {
    readWeekSum += n;
  }

  return (
    <Card id="stats" className="py-0">
      <ul className="divide-y">
        <StatRow
          icon={CalendarRange}
          label="Дней чтения подряд"
          value={streak}
        />
        <StatRow
          icon={BookOpen}
          label="Страниц за неделю"
          value={readWeekSum}
        />
        <StatRow
          icon={BookCheck}
          label="Прочитано книг"
          value={readBooks.length}
        />
        {subscriptionCount !== undefined && (
          <StatRow
            icon={Users2}
            label="Подписки"
            value={subscriptionCount}
            href={subscriptionHref}
          />
        )}
        {followerCount !== undefined && (
          <StatRow
            icon={UsersIcon}
            label="Подписчики"
            value={followerCount}
            href={followerHref}
          />
        )}
      </ul>
    </Card>
  );
}
