"use client";

import {
  BarChartBig,
  BookCopyIcon,
  BookIcon,
  CircleUserIcon,
  HomeIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge as cn } from "tailwind-merge";
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";

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
    // {
    //   href: "search",
    //   label: "Поиск",
    //   icon: SearchIcon,
    // },
    {
      href: "collections",
      label: "Коллекции",
      icon: BookCopyIcon,
    },
    {
      href: "journal",
      label: "Журнал",
      icon: BarChartBig,
    },
    {
      href: "groups",
      label: "Группы",
      icon: Users,
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
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-screen flex-col gap-2 overflow-auto">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 mt-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span>Читательский дневник</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {urls.map((url) => (
                <Link
                  href={`/${url.href}`}
                  className={
                    pathname === `/${url.href}`
                      ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                      : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  }
                  key={url.label}
                  prefetch={true}
                >
                  {React.createElement(url.icon, {
                    className: "w-4 h-4",
                  })}
                  {url.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 pt-0">
            <ModeToggle />
          </div>
        </div>
      </div>
      <div className="fixed bottom-2 left-0 w-full flex items-center justify-center pointer-events-none z-50 md:hidden">
        <div className="w-fit bg-neutral-100/70 dark:bg-neutral-900/70 backdrop-blur-lg flex gap-1 items-center content-center p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 pointer-events-auto overflow-auto max-w-full mx-2">
          {urls.map((url) => (
            <Link href={`/${url.href}`} className="w-fit" key={url.href}>
              <div
                className={cn(
                  "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all relative",
                  pathname === `/${url.href}` && "text-black dark:text-white"
                )}
              >
                {React.createElement(url.icon, {
                  className: "w-[1.3em] h-[1.3em] m-2",
                })}
                <div className="text-xs">{url.label}</div>
                <AnimatePresence>
                  {pathname === `/${url.href}` && (
                    <motion.div
                      layoutId="current"
                      className="w-full h-full absolute top-0 left-0 bg-black/5 dark:bg-white/5 shadow-md -z-10 rounded-md"
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
