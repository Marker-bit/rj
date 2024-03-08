import {
  BookOpen,
  CalendarRange,
  Loader,
  Users2,
  UsersIcon,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import Link from "next/link";
import {
  addHours,
  differenceInDays,
  differenceInMinutes,
  endOfISOWeek,
  max,
  startOfISOWeek,
  subDays,
} from "date-fns";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { Chart } from "./chart";

export async function Stats() {
  const { user } = await validateRequest();
  if (!user) return null;
  const profile = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });
  let events = await db.readEvent.findMany({
    where: {
      book: {
        userId: user.id,
      },
    },
    include: {
      book: true,
    },
    orderBy: {
      readAt: "desc",
    },
  });

  const startAndEndOfWeek = () => {
    const monday = startOfISOWeek(new Date());
    const sunday = endOfISOWeek(new Date());
    return [monday, sunday];
  };
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const [startOfWeek, _] = startAndEndOfWeek();

  let booksStats: { [key: string]: { [key: string]: number } } = {};
  let booksStatsNum: { [key: string]: number } = {};
  let readWeek: { [key: string]: number } = {};
  let readWeekSum = 0;
  let currentWeek: { [key: string]: { [key: string]: number } } = {};
  let currentWeekNum: { [key: string]: number } = {};
  let streak = 0;
  let readSpeed = [];

  if (events) {
    console.log(events);
    for (const event of events) {
      const date = new Date(event.readAt);
      if (!currentWeek[event.bookId]) {
        currentWeek[event.bookId] = {}; // date.getDay().toString()
      }
      const currentBook = events.filter(
        (evt: any) => evt.bookId === event.bookId
      );
      const beforeEventIndex = currentBook.indexOf(event) - 1;
      const beforeEvent = currentBook[beforeEventIndex];
      if (beforeEvent) {
        let beforeEventDate = new Date(beforeEvent.readAt);
        if (differenceInDays(date, beforeEventDate) >= 1) {
          beforeEventDate = max([addHours(date, -5), beforeEventDate]);
        }
        console.log(beforeEventDate, date);
        const minuteDifference = differenceInMinutes(date, beforeEventDate);
        const pageDifference = event.pagesRead - (beforeEvent?.pagesRead ?? 0);
        readSpeed.push(pageDifference / minuteDifference);
      }
      if (date >= startOfWeek) {
        if (
          event.pagesRead >
          (currentWeek[event.bookId][date.getDay().toString()] ?? 0)
        ) {
          const currentBook = events.filter(
            (evt: any) => evt.bookId === event.bookId
          );
          const beforeEventIndex = currentBook.indexOf(event) - 1;
          const beforeEventPages =
            currentBook[beforeEventIndex]?.pagesRead ?? 0;
          if (!currentWeek[event.bookId][date.getDay().toString()]) {
            currentWeek[event.bookId][date.getDay().toString()] = 0;
          }
          currentWeek[event.bookId][date.getDay().toString()] +=
            event.pagesRead - beforeEventPages;
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
      if (
        event.pagesRead >
        (booksStats[event.bookId][date.getDay().toString()] ?? 0)
      ) {
        const currentBook = events.filter(
          (evt: any) => evt.bookId === event.bookId
        );
        const beforeEventIndex = currentBook.indexOf(event) - 1;
        const beforeEventPages = currentBook[beforeEventIndex]?.pagesRead ?? 0;
        if (!booksStats[event.bookId][date.getDay().toString()]) {
          booksStats[event.bookId][date.getDay().toString()] = 0;
        }
        booksStats[event.bookId][date.getDay().toString()] +=
          event.pagesRead - beforeEventPages;
      }
    }
    let day = new Date();
    day = subDays(day, 1);
    // day.setTime(day.getTime() - 86400000);
    while (true) {
      if (
        events.find(
          (e: any) => new Date(e.readAt).toDateString() === day.toDateString()
        )
      ) {
        streak++;
        day = subDays(day, 1);
      } else {
        break;
      }
    }
    if (
      events.find(
        (e: any) =>
          new Date(e.readAt).toDateString() === new Date().toDateString()
      )
    ) {
      streak++;
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

  const currentWeekData = [
    { name: "Пн", value: currentWeekNum["1"] },
    { name: "Вт", value: currentWeekNum["2"] },
    { name: "Ср", value: currentWeekNum["3"] },
    { name: "Чт", value: currentWeekNum["4"] },
    { name: "Пт", value: currentWeekNum["5"] },
    { name: "Сб", value: currentWeekNum["6"] },
    { name: "Вс", value: currentWeekNum["0"] },
  ];

  const data = [
    { name: "Пн", value: booksStatsNum["1"] },
    { name: "Вт", value: booksStatsNum["2"] },
    { name: "Ср", value: booksStatsNum["3"] },
    { name: "Чт", value: booksStatsNum["4"] },
    { name: "Пт", value: booksStatsNum["5"] },
    { name: "Сб", value: booksStatsNum["6"] },
    { name: "Вс", value: booksStatsNum["0"] },
  ];

  return (
    <>
      <div id="stats" className="grid grid-cols-2 grid-rows-2 gap-2 p-2">
        <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
          <CalendarRange className="w-6 h-6" />
          <div className="flex flex-col">
            <div className="font-bold">{streak}</div>
            <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
              дней подряд
            </div>
          </div>
        </div>
        <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
          <BookOpen className="w-6 h-6" />
          <div className="flex flex-col">
            <div className="font-bold">{readWeekSum}</div>
            <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
              страниц прочитано за последнюю неделю
            </div>
          </div>
        </div>
        <Link href="/friends">
          <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
            <Users2 className="w-6 h-6" />
            <div className="flex flex-col">
              <div className="font-bold">{profile.follower.length}</div>
              <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
                подписок
              </div>
            </div>
          </div>
        </Link>
        <Link href="/followers">
          <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
            <UsersIcon className="w-6 h-6" />
            <div className="flex flex-col">
              <div className="font-bold">{profile.following.length}</div>
              <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
                подписчиков
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="bg-gradient-to-b from-zinc-100 to-zinc-200 rounded-full p-1 px-3 mx-auto w-fit cursor-default">
        Эта неделя
      </div>
      <div className="mt-3 h-[20vh]">
        <Chart data={currentWeekData} />
      </div>
      <div className="bg-gradient-to-b from-zinc-100 to-zinc-200 rounded-full p-1 px-3 mx-auto w-fit cursor-default">
        По дням недели
      </div>
      <div className="mt-3 h-[20vh]">
        <Chart data={data} />
      </div>
    </>
  );
}
