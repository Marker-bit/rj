"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarRange,
  Copy,
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
  endOfDay,
  endOfISOWeek,
  max,
  min,
  startOfDay,
  startOfISOWeek,
} from "date-fns";

export function Stats() {
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/profile").then((res) => res.json()),
  });
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => fetch("/api/journal").then((res) => res.json()),
  });
  if (eventsQuery.isPending) {
    return (
      <div className="bg-zinc-100 p-2 py-5 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const startAndEndOfWeek = () => {
    const monday = startOfISOWeek(new Date());
    const sunday = endOfISOWeek(new Date());
    return [monday, sunday];
  };
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const [startOfWeek, _] = startAndEndOfWeek();

  // let booksStats: { [key: string]: { [key: string]: number } } = {
  //   "0": {},
  //   "1": {},
  //   "2": {},
  //   "3": {},
  //   "4": {},
  //   "5": {},
  //   "6": {},
  // };
  let booksStats: { [key: string]: { [key: string]: number } } = {};
  let booksStatsNum: { [key: string]: number } = {};
  let readWeek: { [key: string]: number } = {};
  let readWeekSum = 0;
  let currentWeek: { [key: string]: { [key: string]: number } } = {};
  let currentWeekNum: { [key: string]: number } = {};
  let streak = 0;
  let readSpeed = [];

  const events = eventsQuery.data?.toReversed();

  if (events) {
    for (const event of events) {
      const date = new Date(event.readAt);
      if (!currentWeek[event.bookId]) {
        currentWeek[event.bookId] = {}; // date.getDay().toString()
      }
      const currentBook = events.filter(
        (evt: any) => evt.bookId === event.bookId,
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
        // console.log(
        //   pageDifference,
        //   minuteDifference,
        //   pageDifference / minuteDifference
        // );
        readSpeed.push(pageDifference / minuteDifference);
      }
      if (date >= startOfWeek) {
        if (
          event.pagesRead >
          (currentWeek[event.bookId][date.getDay().toString()] ?? 0)
        ) {
          const currentBook = events.filter(
            (evt: any) => evt.bookId === event.bookId,
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
          (evt: any) => evt.bookId === event.bookId,
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
    const day = new Date();
    day.setTime(day.getTime() - 86400000);
    while (true) {
      if (
        events.find(
          (e: any) => new Date(e.readAt).toDateString() === day.toDateString(),
        )
      ) {
        streak++;
        day.setTime(day.getTime() - 86400000);
      } else {
        break;
      }
    }
    if (
      events.find(
        (e: any) =>
          new Date(e.readAt).toDateString() === new Date().toDateString(),
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
              <div className="font-bold">
                {userQuery.data?.following?.length}
              </div>
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
              <div className="font-bold">
                {userQuery.data?.follower?.length}
              </div>
              <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
                подписчиков
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex gap-2 shadow-md w-fit mx-auto my-2 p-2 rounded-md bg-black/5">
        Эта неделя
      </div>
      <div className="mt-3 h-[20vh]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentWeekData}>
            <Bar
              dataKey="value"
              style={
                {
                  fill: "black",
                  opacity: 0.9,
                } as React.CSSProperties
              }
              label
            />
            <XAxis dataKey="name" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-2 shadow-md w-fit mx-auto my-2 p-2 rounded-md bg-black/5">
        <div className="bg-black/10 p-2 rounded-md cursor-pointer shadow-md">
          Дни недели
        </div>
        <div className="p-2 rounded-md cursor-pointer">Книги</div>
      </div>
      <div className="mt-3 h-[20vh]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar
              dataKey="value"
              style={
                {
                  fill: "black",
                  opacity: 0.9,
                } as React.CSSProperties
              }
              label
            />
            <XAxis dataKey="name" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
