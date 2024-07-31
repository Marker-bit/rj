"use client"

import { getStreak } from "@/lib/stats";
import { declOfNum } from "@/lib/utils";
import { ReadEvent, User } from "@prisma/client";
import {
  addHours,
  differenceInDays,
  differenceInMinutes,
  endOfISOWeek,
  getDay,
  max,
  startOfISOWeek
} from "date-fns";
import {
  BookCheck,
  BookOpen,
  CalendarRange,
  Users2,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export async function Stats({
  profile,
  events,
  books,
}: {
  profile: User & {
    follower: {
      id: string
      firstId: string
      secondId: string
    }[]
    following: {
      id: string
      firstId: string
      secondId: string
    }[]
  }
  events: (ReadEvent & {
    book: {
      id: string
      title: string
      author: string
      pages: number
      description: string
      coverUrl: string | null
      userId: string
    }
  })[]
  books: {
    id: string
    readEvents: {
      pagesRead: number
    }[]
    pages: number
  }[]
}) {
  // const profile = await db.user.findUniqueOrThrow({
  //   where: {
  //     id: user.id,
  //   },
  //   include: {
  //     follower: true,
  //     following: true,
  //   },
  // });
  // let events = await db.readEvent.findMany({
  //   where: {
  //     book: {
  //       userId: user.id,
  //     },
  //   },
  //   include: {
  //     book: true,
  //   },
  //   orderBy: {
  //     readAt: "desc",
  //   },
  // });

  const startAndEndOfWeek = () => {
    const monday = startOfISOWeek(new Date())
    const sunday = endOfISOWeek(new Date())
    return [monday, sunday]
  }
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  const [startOfWeek, _] = startAndEndOfWeek()

  let booksStats: Record<string, Record<string, number>> = {}
  let booksStatsNum: Record<string, number> = {}
  let readWeek: Record<string, number> = {}
  let readWeekSum = 0
  let currentWeek: Record<string, Record<string, number>> = {}
  let currentWeekNum: Record<string, number> = {}
  const {streak} = getStreak(events)
  let readSpeed = []
  const readBooks = books.filter((book) =>
    book.readEvents.find((event) => event.pagesRead >= book.pages)
  )

  if (events) {
    // events?.reverse();
    for (const event of events) {
      const date = new Date(event.readAt)
      if (!currentWeek[event.bookId]) {
        currentWeek[event.bookId] = {}
      }
      const currentBook = events.filter(
        (evt: any) => evt.bookId === event.bookId
      )
      const beforeEventIndex = currentBook.indexOf(event) - 1
      const beforeEvent = currentBook[beforeEventIndex]
      const day = getDay(date).toString()
      if (beforeEvent) {
        let beforeEventDate = new Date(beforeEvent.readAt)
        if (differenceInDays(date, beforeEventDate) >= 1) {
          beforeEventDate = max([addHours(date, -5), beforeEventDate])
        }
        const minuteDifference = differenceInMinutes(date, beforeEventDate)
        const pageDifference = event.pagesRead - (beforeEvent?.pagesRead ?? 0)
        readSpeed.push(pageDifference / minuteDifference)
      }
      if (date >= startOfWeek) {
        if (event.pagesRead > (currentWeek[event.bookId][day] ?? 0)) {
          const currentBook = events.filter(
            (evt: any) => evt.bookId === event.bookId
          )
          const beforeEventIndex = currentBook.indexOf(event) - 1
          const beforeEventPages = currentBook[beforeEventIndex]?.pagesRead ?? 0
          if (!currentWeek[event.bookId][day]) {
            currentWeek[event.bookId][day] = 0
          }
          currentWeek[event.bookId][day] += event.pagesRead - beforeEventPages
        }

        if (!readWeek[event.bookId]) {
          readWeek[event.bookId] = 0
        }
        if (event.pagesRead > readWeek[event.bookId]) {
          readWeek[event.bookId] = event.pagesRead
        }
      }

      if (!booksStats[event.bookId]) {
        booksStats[event.bookId] = {} // date.getDay().toString()
      }
      if (event.pagesRead > (booksStats[event.bookId][day] ?? 0)) {
        const currentBook = events.filter(
          (evt: any) => evt.bookId === event.bookId
        )
        const beforeEventIndex = currentBook.indexOf(event) - 1
        const beforeEventPages = currentBook[beforeEventIndex]?.pagesRead ?? 0
        if (!booksStats[event.bookId][day]) {
          booksStats[event.bookId][day] = 0
        }
        booksStats[event.bookId][day] += event.pagesRead - beforeEventPages
      }
    }
  }

  for (const days of Object.values(booksStats)) {
    for (const [day, num] of Object.entries(days)) {
      if (!booksStatsNum[day]) {
        booksStatsNum[day] = 0
      }
      booksStatsNum[day] += num
    }
  }

  for (const days of Object.values(currentWeek)) {
    for (const [day, num] of Object.entries(days)) {
      if (!currentWeekNum[day]) {
        currentWeekNum[day] = 0
      }
      currentWeekNum[day] += num
    }
  }

  for (const n of Object.values(currentWeekNum)) {
    readWeekSum += n
  }

  const currentWeekData = [
    { name: "Пн", value: currentWeekNum["1"] },
    { name: "Вт", value: currentWeekNum["2"] },
    { name: "Ср", value: currentWeekNum["3"] },
    { name: "Чт", value: currentWeekNum["4"] },
    { name: "Пт", value: currentWeekNum["5"] },
    { name: "Сб", value: currentWeekNum["6"] },
    { name: "Вс", value: currentWeekNum["0"] },
  ]

  const data = [
    { name: "Пн", value: booksStatsNum["1"] },
    { name: "Вт", value: booksStatsNum["2"] },
    { name: "Ср", value: booksStatsNum["3"] },
    { name: "Чт", value: booksStatsNum["4"] },
    { name: "Пт", value: booksStatsNum["5"] },
    { name: "Сб", value: booksStatsNum["6"] },
    { name: "Вс", value: booksStatsNum["0"] },
  ]

  return (
    <>
      <div id="stats" className="grid grid-cols-2 gap-2 p-2">
        <div className="flex items-center gap-1 rounded-md border p-2">
          <CalendarRange className="size-6" />
          <div className="flex flex-col">
            <div className="font-bold">{streak}</div>
            <div className="-mt-1 text-xs lowercase text-muted-foreground/70">
              {declOfNum(streak, ["день", "дня", "дней"])} подряд
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-md border p-2">
          <BookOpen className="size-6" />
          <div className="flex flex-col">
            <div className="font-bold">{readWeekSum}</div>
            <div className="-mt-1 text-xs lowercase text-muted-foreground/70">
              {declOfNum(readWeekSum, [
                "страница прочитана",
                "страницы прочитаны",
                "страниц прочитано",
              ])}{" "}
              за последнюю неделю
            </div>
          </div>
        </div>
        <div className="col-span-2 flex items-center gap-1 rounded-md border p-2">
          <BookCheck className="size-6" />
          <div className="flex flex-col">
            <div className="font-bold">{readBooks.length}</div>
            <div className="-mt-1 text-xs lowercase text-muted-foreground/70">
              {declOfNum(streak, [
                "прочитанная книга",
                "прочитанные книги",
                "прочитанных книг",
              ])}
            </div>
          </div>
        </div>
        <Link href="/friends">
          <div className="flex items-center gap-1 rounded-md border p-2 transition-colors hover:bg-muted">
            <Users2 className="size-6" />
            <div className="flex flex-col">
              <div className="font-bold">{profile.follower.length}</div>
              <div className="-mt-1 text-xs lowercase text-muted-foreground/70">
                {declOfNum(profile.follower.length, [
                  "подписка",
                  "подписки",
                  "подписок",
                ])}
              </div>
            </div>
          </div>
        </Link>
        <Link href="/followers">
          <div className="flex items-center gap-1 rounded-md border p-2 transition-colors hover:bg-muted">
            <UsersIcon className="size-6" />
            <div className="flex flex-col">
              <div className="font-bold">{profile.following.length}</div>
              <div className="-mt-1 text-xs lowercase text-muted-foreground/70">
                {declOfNum(profile.following.length, [
                  "подписчик",
                  "подписчика",
                  "подписчиков",
                ])}
              </div>
            </div>
          </div>
        </Link>
      </div>
      {/* <div className="mx-auto w-fit cursor-default rounded-full bg-gradient-to-b from-zinc-100 to-zinc-200 p-1 px-3 dark:from-zinc-900 dark:to-zinc-800">
        Эта неделя
      </div>
      <div className="mt-3 h-[20vh]">
        <Chart data={currentWeekData} />
      </div>
      <div className="mx-auto w-fit cursor-default rounded-full bg-gradient-to-b from-zinc-100 to-zinc-200 p-1 px-3 dark:from-zinc-900 dark:to-zinc-800">
        По дням недели
      </div>
      <div className="mt-3 h-[20vh]">
        <Chart data={data} />
      </div> */}
    </>
  )
}
