"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SimpleTooltip,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getDays, getStreak } from "@/lib/stats"
import { capitalizeFirstLetter, cn, declOfNum } from "@/lib/utils"
import { ReadEvent } from "@prisma/client"
import { addDays, differenceInDays, format, startOfWeek } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { use, useState } from "react"

export function StreakButton({
  events: eventsPromise,
}: {
  events: Promise<ReadEvent[]>
}) {
  const [weekPadding, setWeekPadding] = useState(0)
  const events = use(eventsPromise)
  const { streak } = getStreak(events)
  const days = getDays(events, weekPadding)
  const nowDay = differenceInDays(
    new Date(),
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  return (
    <Popover>
      <SimpleTooltip text="Ваш стрик">
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full"
          >
            <CalendarIcon className="size-4" />
            {streak}
          </Button>
        </PopoverTrigger>
      </SimpleTooltip>
      <PopoverContent className="w-fit">
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "size-8 rounded-xl",
                      days[i] === 0
                        ? "bg-zinc-300 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
                        : "bg-green-300 dark:bg-green-700 border border-green-500",
                      weekPadding === 0 &&
                        nowDay === i &&
                        "border-4 border-black dark:border-white"
                    )}
                  />
                  <p className="text-xs">
                    {capitalizeFirstLetter(
                      format(
                        addDays(
                          startOfWeek(new Date(), { weekStartsOn: 1 }),
                          i
                        ),
                        "EEE",
                        {
                          locale: ru,
                          weekStartsOn: 1,
                        }
                      )
                    ).slice(0, 2)}
                  </p>
                  <p className="text-xs">{days[i]}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {days[i]}{" "}
                {declOfNum(days[i], ["страница", "страницы", "страниц"])}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex gap-2 items-center justify-between mt-2">
          <button
            onClick={() => setWeekPadding((w) => w - 1)}
            className="text-xs font-medium hover:underline disabled:no-underline disabled:opacity-50"
          >
            Назад
          </button>
          <div className="text-muted-foreground text-xs">
            {weekPadding === 0
              ? "Эта неделя"
              : weekPadding === -1
              ? "Прошлая неделя"
              : `${Math.abs(weekPadding)} ${declOfNum(Math.abs(weekPadding), [
                  "неделя",
                  "недели",
                  "недель",
                ])} назад`}
          </div>
          <button
            className="text-xs font-medium hover:underline disabled:no-underline disabled:opacity-50"
            disabled={weekPadding === 0}
            onClick={() => setWeekPadding((w) => w + 1)}
          >
            Вперёд
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
