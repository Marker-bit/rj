"use client";

import {
  BookOpen,
  CalendarDays,
  CalendarRange,
  Check,
  ChevronLeft,
  Copy,
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
import { AnimatePresence, motion } from "framer-motion";

export default function ProfilePage() {
  // const [userData, setUserData] = useState<User | null>(null);

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return fetch("/api/profile").then((res) => res.json());
    },
  });

  const [copy, setCopy] = useState(false);

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

  const url = `${window.location.origin}/profile/${userData?.username}`;

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
        <Link href="/friends" className="ml-auto">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <div className="font-semibold"><Users2 className="w-6 h-6" /></div>
          </button>
        </Link>
        <Link href="/profile/settings">
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
      <div className="flex items-center justify-center">
        <div className="p-2 border border-zinc-200 rounded-xl flex gap-2 items-center">
          {url}
          <div
            className="hover:bg-black/10 flex items-center justify-center p-2 rounded-xl cursor-pointer relative"
            onClick={() => {
              navigator.clipboard.writeText(url);
              if (copy) return;
              setCopy(true);
              setTimeout(() => {
                setCopy(false);
              }, 1000);
            }}
          >
            <Copy className="opacity-0 w-4 h-4" />
            <AnimatePresence>
              {/* {copy ? ( */}
                <motion.div
                  variants={{
                    copy: { scale: 1, opacity: 1 },
                    notCopy: { scale: 0, opacity: 0 },
                  }}
                  animate={copy ? "copy" : "notCopy"}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="absolute"
                >
                  <Check className="text-green-500 w-4 h-4" />
                </motion.div>
              {/* ) : ( */}
                <motion.div
                  variants={{
                    copy: { scale: 1, opacity: 1 },
                    notCopy: { scale: 0, opacity: 0 },
                  }}
                  animate={!copy ? "copy" : "notCopy"}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="absolute"
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              {/* )} */}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Stats />
    </div>
  );
}
