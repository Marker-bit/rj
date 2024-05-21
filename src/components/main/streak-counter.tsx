"use client"

import { getDays, getStreak } from "@/lib/stats"
import { capitalizeFirstLetter, cn, declOfNum } from "@/lib/utils"
import { ReadEvent } from "@prisma/client"
import { addDays, differenceInDays, format, startOfWeek } from "date-fns"
import { User } from "lucia"
import { PartyPopper } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { ru } from "date-fns/locale"

export function StreakCounter({
  events,
  user,
}: {
  events: ReadEvent[]
  user: User
}) {
  const streak = getStreak(events)
  const days = getDays(events)
  const nowDay = differenceInDays(new Date(), startOfWeek(new Date())) - 1

  // if (
  //   (streak % 50 !== 0 && user.id !== "clsqfrmec000013rgpmmb8eok") ||
  //   streak === 0
  // ) {
  //   return <></>
  // }

  return (
    <div className="m-2 flex flex-col gap-2">
      <div className="flex flex-col rounded-xl border border-green-300 bg-green-100 p-2 text-green-500 dark:border-green-800 dark:bg-green-950 max-sm:items-center max-sm:text-center">
        <p className="text-xl font-bold">
          {days[nowDay] === 0
            ? "Вы не читали книги сегодня"
            : "Вы прочитали " +
              days[nowDay] +
              " " +
              declOfNum(days[nowDay], ["страницу", "страницы", "страниц"])}
        </p>
        <div className="grid grid-cols-7 gap-2 self-start max-sm:self-center">
          {Array.from({ length: 7 }).map((_, i) => (
            <HoverCard key={i} openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div
                  key={i}
                  className={cn(
                    "size-8 rounded-xl",
                    days[i] === 0
                      ? "bg-zinc-300 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
                      : "bg-green-300 dark:bg-green-700 border border-green-500",
                    nowDay === i && "border-4 border-black dark:border-white"
                  )}
                />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-300 dark:bg-green-700">
                    {days[i]}
                  </div>

                  {capitalizeFirstLetter(
                    format(addDays(new Date(), i), "EEEE", { locale: ru })
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
      <div className="flex gap-2 overflow-hidden rounded-xl bg-orange-500 p-2 text-white">
        <div className="text-9xl font-bold">{streak}</div>
        <div className="max-sm:hidden">
          <div className="text-2xl font-bold">Ваша активность</div>
          <div className="text-lg">Сколько дней вы читаете подряд</div>
        </div>
        <div className="hidden max-sm:block">
          <div className="text-2xl font-bold">
            {declOfNum(streak, ["день", "дня", "дней"])} подряд
          </div>
        </div>
        <div className="ml-auto mt-auto translate-x-8 translate-y-8">
          <PartyPopper className="size-32 -scale-x-100 text-orange-200" />
        </div>
      </div>
    </div>
  )
}
