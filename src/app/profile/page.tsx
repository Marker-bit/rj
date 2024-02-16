"use client";

import {
  BookOpen,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  HomeIcon,
  Plus,
  Settings,
  UserPlus,
  Users2,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const data02 = [
  { name: "Group A", value: 2400 },
  { name: "Group B", value: 4567 },
  { name: "Group C", value: 1398 },
  { name: "Group D", value: 9800 },
  { name: "Group E", value: 3908 },
  { name: "Group F", value: 4800 },
];

export default function ProfilePage() {
  const data01 = [
    { name: "Понедельник", value: 40 },
    { name: "Вторник", value: 300 },
    { name: "Среда", value: 300 },
    { name: "Четверг", value: 200 },
    { name: "Пятница", value: 278 },
    { name: "Суббота", value: 189 },
    { name: "Воскресенье", value: 189 },
  ];
  return (
    <div>
      {/* <div className="flex gap-2 pb-2">
        <Link href="/">
          <button className="p-1 hover:bg-black/10 transition-colors rounded-md">
            <HomeIcon className="w-6 h-6" />
          </button>
        </Link>
        <Link href="/profile/settings" className="ml-auto">
          <button className="p-1 hover:bg-black/10 transition-colors rounded-md">
            <Settings className="w-6 h-6" />
          </button>
        </Link>
      </div> */}
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
            <div className="font-semibold">Настройки</div>
          </button>
        </Link>
      </div>
      <div className="m-3 p-4 rounded-md border border-zinc-200 flex gap-2 items-center">
        <Image
          src="/avatar.jpg"
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full w-20 h-20"
        />
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">Mark Pentus</div>
          <div className="text-sm text-black/70">@mark.pentus</div>
          {/* <div className="bg-blue-500 p-2 rounded-md shadow-md shadow-blue-300 cursor-pointer flex items-center justify-center text-white text-sm mt-2">
            <UserPlus className="w-4 h-4 mr-2" />
            Добавить в друзья
          </div> */}
        </div>
      </div>
      <div id="stats" className="grid grid-cols-2 grid-rows-2 gap-2 p-2">
        <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
          <CalendarRange className="w-6 h-6" />
          <div className="flex flex-col">
            <div className="font-bold">10</div>
            <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
              дней подряд
            </div>
          </div>
        </div>
        <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
          <BookOpen className="w-6 h-6" />
          <div className="flex flex-col">
            <div className="font-bold">10</div>
            <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
              страниц прочитано за последнюю неделю
            </div>
          </div>
        </div>
        <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
          <Users2 className="w-6 h-6" />
          <div className="flex flex-col">
            <div className="font-bold">10</div>
            <div className="text-black/50 lowercase text-xs -mt-1 font-semibold">
              подписок
            </div>
          </div>
        </div>
        <div className="p-2 border border-zinc-300 rounded-md flex gap-1 items-center">
          <UsersIcon className="w-6 h-6" />
          <div className="flex flex-col">
            <div className="font-bold">10</div>
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
          <BarChart data={data01}>
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
    </div>
  );
}
