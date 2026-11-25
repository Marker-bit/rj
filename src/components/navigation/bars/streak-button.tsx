"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  useReadingStats,
  useStreakEvents,
} from "@/components/main/streak-context";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalizeFirstLetter, cn, declOfNum } from "@/lib/utils";

export function StreakButton() {
  const [weekOffset, setWeekOffset] = useState(0);
  const events = useStreakEvents();
  const stats = useReadingStats(events);
  if (!stats) return <div className="h-9 w-14" />;
  const weekDays = stats.week(weekOffset);

  return (
    <Popover>
      <SimpleTooltip text="Ваш стрик">
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full"
          >
            <CalendarIcon className="size-4" />
            {stats.streak}
          </Button>
        </PopoverTrigger>
      </SimpleTooltip>
      <PopoverContent className="w-fit">
        <div className="flex gap-2">
          {weekDays.map(({ date, pagesRead: pages, daysAgo: daysPassed }) => {
            return (
              <Tooltip key={date.toISOString()}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="flex flex-col items-center gap-1"
                    aria-label={`${format(date, "d MMMM", { locale: ru })}, ${pages} ${declOfNum(pages, ["страница", "страницы", "страниц"])}`}
                  >
                    <span
                      className={cn(
                        "size-8 rounded-xl",
                        pages === 0
                          ? "bg-zinc-300 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
                          : "bg-green-300 dark:bg-green-700 border border-green-500",
                        daysPassed === 0 &&
                          "border-4 border-black dark:border-white",
                      )}
                    />
                    <span className="text-xs">
                      {capitalizeFirstLetter(
                        format(date, "EEE", {
                          locale: ru,
                          weekStartsOn: 1,
                        }),
                      ).slice(0, 2)}
                    </span>
                    <span className="text-xs">{pages}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-center">
                  <div className="text-background/70">
                    {daysPassed === 0
                      ? "Сегодня"
                      : daysPassed > 0
                        ? `${daysPassed} ${declOfNum(daysPassed, [
                            "день",
                            "дня",
                            "дней",
                          ])} назад`
                        : `${Math.abs(daysPassed)} ${declOfNum(
                            Math.abs(daysPassed),
                            ["день", "дня", "дней"],
                          )} вперёд`}
                  </div>
                  <div className="text-background/70">
                    {format(date, "d MMMM", { locale: ru, weekStartsOn: 1 })}
                  </div>
                  {pages}{" "}
                  {declOfNum(pages, ["страница", "страницы", "страниц"])}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        <div className="flex gap-2 items-center justify-between mt-2">
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w - 1)}
            className="text-xs font-medium hover:underline disabled:no-underline disabled:opacity-50"
          >
            Назад
          </button>
          <div className="text-muted-foreground text-xs">
            {weekOffset === 0
              ? "Эта неделя"
              : weekOffset === -1
                ? "Прошлая неделя"
                : `${Math.abs(weekOffset)} ${declOfNum(Math.abs(weekOffset), [
                    "неделя",
                    "недели",
                    "недель",
                  ])} назад`}
          </div>
          <button
            type="button"
            className="text-xs font-medium hover:underline disabled:no-underline disabled:opacity-50"
            disabled={weekOffset === 0}
            onClick={() => setWeekOffset((w) => w + 1)}
          >
            Вперёд
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
