"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
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
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function StreakButton({ events }: { events: ReadEvent[] }) {
  const streak = getStreak(events)
  const days = getDays(events)
  const nowDay = differenceInDays(new Date(), startOfWeek(new Date())) - 1
  const router = useRouter()

  const logOut = () => {
    toast.promise(
      async () => {
        await fetch("/api/auth/", {
          method: "DELETE",
        })
        router.refresh()
      },
      {
        loading: "Выход...",
        success: "Вы вышли из аккаунта",
        error: (error) => `Возникла проблема при выходе: ${error.message}`,
      }
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          {streak}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "size-8 rounded-xl",
                      nowDay > i
                        ? "bg-zinc-200 dark:bg-zinc-800"
                        : days[i] === 0
                        ? "bg-zinc-300 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
                        : "bg-green-300 dark:bg-green-700 border border-green-500",
                      nowDay === i && "border-4 border-black dark:border-white"
                    )}
                  />
                  <p className="text-xs">
                    {capitalizeFirstLetter(
                      format(addDays(new Date(), i), "EE", { locale: ru })
                    ).slice(0, 2)}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {days[i]}{" "}
                {declOfNum(days[i], ["страница", "страницы", "страниц"])}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
