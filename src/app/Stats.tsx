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
import moment from "moment";

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
    moment.updateLocale("ru", {
      week: {
        dow: 1, // Monday is the first day of the week.
      },
    });
    // moment().locale("ru");
    const monday = moment().startOf("week").toDate();
    const sunday = moment().endOf("week").toDate();
    return [monday, sunday];
  };
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const [startOfWeek, _] = startAndEndOfWeek();

  let booksStats: { [key: string]: { [key: string]: number } } = {
    "0": {},
    "1": {},
    "2": {},
    "3": {},
    "4": {},
    "5": {},
    "6": {},
  };
  let booksStatsNum: { [key: string]: number } = {};
  // let readWeek = 0;
  let readWeek: { [key: string]: number } = {};
  let readWeekSum = 0;
  let streak = 0;
  console.log(startOfWeek);
  if (eventsQuery.data) {
    for (const event of eventsQuery.data) {
      const date = new Date(event.readAt);
      if (!booksStats[date.getDay().toString()]) {
        booksStats[date.getDay().toString()] = {};
      }
      if (
        event.pagesRead >
        (booksStats[date.getDay().toString()][event.bookId] ?? 0)
      ) {
        booksStats[date.getDay().toString()][event.bookId] = event.pagesRead;
      }
      if (date >= startOfWeek) {
        if (!readWeek[event.bookId]) {
          readWeek[event.bookId] = 0;
        }
        if (event.pagesRead > readWeek[event.bookId]) {
          readWeek[event.bookId] = event.pagesRead;
        }
      }
    }
    for (const n of Object.values(readWeek)) {
      readWeekSum += n;
    }
    const day = new Date();
    day.setTime(day.getTime() - 86400000);
    while (true) {
      if (
        eventsQuery.data.find(
          (e: any) => new Date(e.readAt).toDateString() === day.toDateString()
        )
      ) {
        streak++;
        day.setTime(day.getTime() - 86400000);
      } else {
        break;
      }
    }
    if (
      eventsQuery.data.find(
        (e: any) =>
          new Date(e.readAt).toDateString() === new Date().toDateString()
      )
    ) {
      streak++;
    }
  }

  for (const [m, i] of Object.entries(booksStats)) {
    for (const x of Object.values(i)) {
      booksStatsNum[m] = x;
    }
  }

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
        <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
          <Users2 className="w-6 h-6" />
          <div className="flex flex-col">
            <div className="font-bold">{userQuery.data?.following?.length}</div>
            <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
              подписок
            </div>
          </div>
        </div>
        <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
          <UsersIcon className="w-6 h-6" />
          <div className="flex flex-col">
            <div className="font-bold">{userQuery.data?.follower?.length}</div>
            <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
              подписчиков
            </div>
          </div>
        </div>
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
