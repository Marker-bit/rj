import { ModeToggle } from "@/components/mode-toggle"
import {
  BarChartBig,
  BookCopyIcon,
  BookIcon,
  CircleUserIcon,
  HomeIcon,
  Users,
} from "lucide-react"
import Link from "next/link"
import React, { Suspense } from "react"
import { BottomLink, BottomLinkMobile } from "./bottom-link"
import { StreakBar } from "./bars/streak-bar"
import { UserBar } from "./bars/user-bar"

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
            <nav className="grid items-start justify-start px-2 text-sm font-medium lg:px-4">
              {urls.map((url) => (
                <BottomLink href={url.href} key={url.label}>
                  {React.createElement(url.icon, {
                    className: "w-4 h-4",
                  })}
                  {url.label}
                </BottomLink>
              ))}
            </nav>
          </div>
          <div className="mt-auto flex flex-wrap gap-2 p-4 pt-0">
            <ModeToggle />
            <Suspense fallback={<></>}>
              <StreakBar />
            </Suspense>
            <Suspense fallback={<></>}>
              <UserBar />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="pointer-events-none fixed bottom-2 left-0 z-50 flex w-full items-center justify-center md:hidden">
        <div className="pointer-events-auto mx-2 flex w-fit max-w-full content-center items-center gap-1 overflow-auto rounded-xl border bg-white/70 p-2 backdrop-blur-lg dark:bg-black/70">
          {urls.map((url) => (
            <BottomLinkMobile href={`/${url.href}`} key={url.href}>
              {React.createElement(url.icon, {
                className: "w-[1.3em] h-[1.3em] m-2",
              })}
              <div className="text-xs">{url.label}</div>
            </BottomLinkMobile>
          ))}
        </div>
      </div>
    </>
  )
}
