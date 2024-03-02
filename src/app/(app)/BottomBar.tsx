"use client";

import {
  BarChartBig,
  Book,
  BookPlus,
  CircleUser,
  HomeIcon,
  ListPlus,
  Plus,
  Search,
  Settings,
  Users2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge as cn } from "tailwind-merge";

export function BottomBar() {
  const pathname = usePathname();
  return (
    <>
      <div className="fixed bottom-2 left-0 w-full flex items-center justify-center pointer-events-none">
        <div className="w-fit bg-white/70 backdrop-blur-lg grid grid-cols-5 items-center justify-center content-center p-2 min-h-[10vh] rounded-xl border border-zinc-200 pointer-events-auto">
          <AnimatePresence>
            <Link href="/home" className="w-fit">
              <div
                className={cn(
                  "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all relative",
                  pathname === "/home" && "text-black"
                )}
              >
                <HomeIcon className="w-6 h-6 m-2" />
                <div className="text-xs">Главная</div>
                {pathname === "/home" && (
                  <motion.div
                    layoutId="current"
                    className="w-full h-full absolute top-0 left-0 bg-black/5 shadow-md -z-10 rounded-md"
                    transition={{
                      type: "spring",
                    }}
                  />
                )}
              </div>
            </Link>
            <Link href="/books" className="w-fit">
              <div
                className={cn(
                  "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all relative w-fit",
                  pathname === "/books" && "text-black"
                )}
              >
                <Book className="w-6 h-6 m-2" />
                <div className="text-xs">Книги</div>
                {pathname === "/books" && (
                  <motion.div
                    layoutId="current"
                    className="w-full h-full absolute top-0 left-0 bg-black/5 shadow-md -z-10 rounded-md"
                    transition={{
                      type: "spring",
                    }}
                  />
                )}
              </div>
            </Link>
            <Link href="/search" className="w-fit">
              <div
                className={cn(
                  "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all relative w-fit",
                  pathname === "/search" && "text-black"
                )}
              >
                <Search className="w-6 h-6 m-2" />
                <div className="text-xs">Поиск</div>
                {pathname === "/search" && (
                  <motion.div
                    layoutId="current"
                    className="w-full h-full absolute top-0 left-0 bg-black/5 shadow-md -z-10 rounded-md"
                    transition={{
                      type: "spring",
                    }}
                  />
                )}
              </div>
            </Link>
            <Link href="/journal" className="w-fit">
              <div
                className={cn(
                  "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all relative w-fit",
                  pathname === "/journal" && "text-black"
                )}
              >
                <BarChartBig className="w-6 h-6 m-2" />
                <div className="text-xs">Журнал</div>
                {pathname === "/journal" && (
                  <motion.div
                    layoutId="current"
                    className="w-full h-full absolute top-0 left-0 bg-black/5 shadow-md -z-10 rounded-md"
                    transition={{
                      type: "spring",
                    }}
                  />
                )}
              </div>
            </Link>
            {/* <div
          className="flex flex-col text-black items-center cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="bg-black p-2 rounded-full text-white">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-xs">Добавить</div>
        </div> */}
            <Link href="/profile" className="w-fit">
              <div
                className={cn(
                  "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all relative w-fit",
                  pathname.startsWith("/profile") && "text-black"
                )}
              >
                {pathname === "/profile/settings" ? (
                  <Settings className="w-6 h-6 m-2" />
                ) : (
                  <CircleUser className="w-6 h-6 m-2" />
                )}
                <div className="text-xs">
                  {pathname === "/profile/settings" ? "Настройки" : "Профиль"}
                </div>
                {pathname === "/profile" && (
                  <motion.div
                    layoutId="current"
                    className="w-full h-full absolute top-0 left-0 bg-black/5 shadow-md -z-10 rounded-md"
                    transition={{
                      type: "spring",
                    }}
                  />
                )}
              </div>
            </Link>
            {/* <Link href="/stats">
          <div
            className={cn(
              "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all",
              selectedTab === 4 && "bg-black/5 shadow-md text-black"
            )}
            onClick={() => setSelectedTab(4)}
          >
            <BarChartBig className="w-6 h-6 m-2" />
            <div className="text-xs">Статистика</div>
          </div>
        </Link> */}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
