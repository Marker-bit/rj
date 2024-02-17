"use client";

import {
  BookOpen,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  Edit,
  HomeIcon,
  Loader,
  Plus,
  Settings,
  UserPlus,
  Users2,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { User } from "lucia";
import { validateRequest } from "@/lib/validate-request";
import { useQuery } from "@tanstack/react-query";
import { Stats } from "../Stats";

const data02 = [
  { name: "Group A", value: 2400 },
  { name: "Group B", value: 4567 },
  { name: "Group C", value: 1398 },
  { name: "Group D", value: 9800 },
  { name: "Group E", value: 3908 },
  { name: "Group F", value: 4800 },
];

export default function ProfilePage() {
  // const [userData, setUserData] = useState<User | null>(null);

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return fetch("/api/profile").then((res) => res.json());
    },
  });

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => fetch("/api/journal").then((res) => res.json()),
  });

  const startAndEndOfWeek = (date: Date) => {
    const now = date ? new Date(date) : new Date().setHours(0, 0, 0, 0);
    const monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    const sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    return [monday, sunday];
  };
  const [startOfWeek, _] = startAndEndOfWeek(new Date());

  let booksStats: { [key: string]: number } = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
  };
  let readWeek = 0;
  let streak = 0;
  if (eventsQuery.data) {
    for (const event of eventsQuery.data) {
      const date = new Date(event.readAt);
      booksStats[date.getDay().toString()] += event.pagesRead;
      if (date >= startOfWeek) {
        readWeek += event.pagesRead;
      }
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

  const data = [
    { name: "Понедельник", value: booksStats["1"] },
    { name: "Вторник", value: booksStats["2"] },
    { name: "Среда", value: booksStats["3"] },
    { name: "Четверг", value: booksStats["4"] },
    { name: "Пятница", value: booksStats["5"] },
    { name: "Суббота", value: booksStats["6"] },
    { name: "Воскресенье", value: booksStats["0"] },
  ];

  // const data01 = [
  //   { name: "Понедельник", value: 40 },
  //   { name: "Вторник", value: 300 },
  //   { name: "Среда", value: 300 },
  //   { name: "Четверг", value: 200 },
  //   { name: "Пятница", value: 278 },
  //   { name: "Суббота", value: 189 },
  //   { name: "Воскресенье", value: 189 },
  // ];
  // useEffect(() => {
  //   (async () => {
  //     const { user } = await validateRequest();
  //     console.log(user);
  //     setUserData(user);
  //   })();
  // }, []);

  if (userQuery.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const userData = userQuery.data!;

  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
        <Link href="/">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
          Профиль
        </div>
        <Link href="/profile/settings" className="ml-auto">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <div className="font-semibold">
              <Edit className="w-6 h-6" />
            </div>
          </button>
        </Link>
      </div>
      <div className="m-3 p-4 rounded-md border border-zinc-200 flex gap-2 items-center">
        <Image
          src="/no-avatar.png"
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full w-20 h-20"
        />
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">
            {userData?.firstName} {userData?.lastName}
          </div>
          <div className="text-sm text-black/70">@{userData?.username}</div>
          {/* <div className="bg-blue-500 p-2 rounded-md shadow-md shadow-blue-300 cursor-pointer flex items-center justify-center text-white text-sm mt-2">
            <UserPlus className="w-4 h-4 mr-2" />
            Добавить в друзья
          </div> */}
        </div>
      </div>
      <Stats />
    </div>
  );
}
