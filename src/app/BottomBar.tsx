"use client";

import {
  BarChartBig,
  Book,
  BookPlus,
  CircleUser,
  HomeIcon,
  ListPlus,
  Plus,
  Settings,
  Users2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge as cn } from "tailwind-merge";

export function BottomBar() {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const pathname = usePathname();
  return (
    <>
      {/* <div
        className={cn(
          "fixed bottom-0 left-0 z-10 p-4 rounded-t-3xl bg-black w-full text-white max-h-[50vh] overflow-auto transition-all",
          !open && "translate-y-full"
        )}
      >
        <div className="mx-auto bg-white/30 w-20 h-2 rounded-md mb-4" />
        <div className="ml-auto w-fit">
          <button onClick={() => setOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="bg-white p-2 rounded-full">
              <BookPlus className="w-6 h-6 text-black" />
            </div>
            <div>Создать книгу</div>
          </div>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="bg-white p-2 rounded-full">
              <ListPlus className="w-6 h-6 text-black" />
            </div>
            <div>Создать полку</div>
          </div>
        </div>
      </div> */}
      <div className="sticky bottom-0 left-0 w-full bg-gray-200 grid grid-cols-5 items-center justify-around p-2 min-h-[10vh]">
        <Link href="/">
          <div
            className={cn(
              "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all",
              pathname === "/" && "bg-black/5 shadow-md text-black"
            )}
            onClick={() => setSelectedTab(0)}
          >
            <HomeIcon className="w-6 h-6 m-2" />
            <div className="text-xs">Главная</div>
          </div>
        </Link>
        <Link href="/books">
          <div
            className={cn(
              "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all",
              pathname === "/books" && "bg-black/5 shadow-md text-black"
            )}
          >
            <Book className="w-6 h-6 m-2" />
            <div className="text-xs">Книги</div>
          </div>
        </Link>
        <Link href="/friends">
          <div
            className={cn(
              "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all",
              pathname === "/friends" && "bg-black/5 shadow-md text-black"
            )}
          >
            <Users2 className="w-6 h-6 m-2" />
            <div className="text-xs">Друзья</div>
          </div>
        </Link>
        <Link href="/journal">
          <div
            className={cn(
              "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all",
              pathname === "/journal" && "bg-black/5 shadow-md text-black"
            )}
          >
            <BarChartBig className="w-6 h-6 m-2" />
            <div className="text-xs">Журнал</div>
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
        <Link href="/profile">
          <div
            className={cn(
              "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all",
              pathname.startsWith("/profile") &&
                "bg-black/5 shadow-md text-black"
            )}
            onClick={() => setSelectedTab(3)}
          >
            {pathname === "/profile/settings" ? (
              <Settings className="w-6 h-6 m-2" />
            ) : (
              <CircleUser className="w-6 h-6 m-2" />
            )}
            <div className="text-xs">
              {pathname === "/profile/settings" ? "Настройки" : "Профиль"}
            </div>
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
      </div>
    </>
  );
}
