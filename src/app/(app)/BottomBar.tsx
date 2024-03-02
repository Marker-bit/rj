"use client";

import {
  BarChartBig,
  Book,
  BookIcon,
  CircleUser,
  CircleUserIcon,
  HomeIcon,
  Search,
  SearchIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge as cn } from "tailwind-merge";
import React from "react";

export function BottomBar() {
  const urls = [
    {
      href: "home",
      label: "Главная",
      icon: HomeIcon,
    },
    {
      href: "books",
      label: "Книги",
      icon: BookIcon,
    },
    {
      href: "search",
      label: "Поиск",
      icon: SearchIcon,
    },
    {
      href: "journal",
      label: "Журнал",
      icon: BarChartBig,
    },
    {
      href: "profile",
      label: "Профиль",
      icon: CircleUserIcon,
    },
  ];
  const pathname = usePathname();
  return (
    <>
      <div className="fixed bottom-2 left-0 w-full flex items-center justify-center pointer-events-none">
        <div className="w-fit bg-white/70 backdrop-blur-lg grid grid-cols-5 items-center justify-center content-center p-2 min-h-[10vh] rounded-xl border border-zinc-200 pointer-events-auto overflow-hidden">
          {urls.map((url) => (
            <Link href={`/${url.href}`} className="w-fit" key={url.href}>
              <div
                className={cn(
                  "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all relative",
                  pathname === `/${url.href}` && "text-black",
                )}
              >
                {React.createElement(url.icon, {
                  className: "w-6 h-6 m-2",
                })}
                <div className="text-xs">{url.label}</div>
                <AnimatePresence>
                  {pathname === `/${url.href}` && (
                    <motion.div
                      layoutId="current"
                      className="w-full h-full absolute top-0 left-0 bg-black/5 shadow-md -z-10 rounded-md"
                      transition={{
                        type: "tween",
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
