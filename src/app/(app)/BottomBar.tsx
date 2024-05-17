"use client"

import {
  BarChartBig,
  BookCopyIcon,
  BookIcon,
  CircleUserIcon,
  HomeIcon,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { twMerge as cn } from "tailwind-merge"
import React from "react"
import { ModeToggle } from "@/components/mode-toggle"

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
  ]
  const pathname = usePathname()
  return (
    <>
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-screen flex-col gap-2 overflow-auto">
          <div className="mt-2 flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
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
      <div className="pointer-events-none fixed bottom-2 left-0 z-50 flex w-full items-center justify-center md:hidden">
        <div className="pointer-events-auto mx-2 flex w-fit max-w-full content-center items-center gap-1 overflow-auto rounded-xl border bg-white/70 p-2 backdrop-blur-lg dark:bg-black/70">
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
                      className="absolute left-0 top-0 -z-10 size-full rounded-md bg-black/5 shadow-md dark:bg-white/5"
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
  )
}
