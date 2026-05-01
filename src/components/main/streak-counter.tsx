"use client";

import type { ReadEvent } from "@prisma/client";
import { addDays, differenceInDays, format, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";
import type { User } from "lucia";
import { getDays, getStreak, goodNumbers } from "@/lib/stats";
import { capitalizeFirstLetter, cn, declOfNum } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

export function StreakCounter({
  events,
  user: _user,
}: {
  events: ReadEvent[];
  user: User;
}) {
  const { streak } = getStreak(events);
  const days = getDays(events);
  const nowDay = differenceInDays(
    new Date(),
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = days.map((pages, dayIndex) => {
    const weekDate = addDays(currentWeekStart, dayIndex);
    return {
      pages,
      date: weekDate,
      key: weekDate.toISOString(),
    };
  });

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
          {weekDays.map((weekDay, dayIndex) => (
            <HoverCard key={weekDay.key} openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "size-8 rounded-xl",
                      weekDay.pages === 0
                        ? "bg-zinc-300 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
                        : "bg-green-300 dark:bg-green-700 border border-green-500",
                      nowDay === dayIndex &&
                        "border-4 border-black dark:border-white",
                    )}
                  />

                  <p className="text-xs md:hidden">
                    {format(
                      weekDay.date,
                      "EEE",
                      { locale: ru },
                    ).slice(0, 2)}
                  </p>
                  <p className="text-xs md:hidden">{weekDay.pages}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-300 dark:bg-green-700">
                    {weekDay.pages}
                  </div>

                  {capitalizeFirstLetter(
                    format(
                      weekDay.date,
                      "EEEE",
                      { locale: ru },
                    ),
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
      {!goodNumbers.includes(streak) && (
        <div className="flex gap-2 overflow-hidden rounded-xl border p-2">
          <div className="text-5xl font-bold">{streak}</div>
          <div className="max-sm:hidden">
            <div className="text-2xl font-bold">Ваша активность</div>
            <div className="text-lg">Сколько дней вы читаете подряд</div>
          </div>
          <div className="hidden max-sm:block">
            <div className="text-2xl font-bold">
              {declOfNum(streak, ["день", "дня", "дней"])} подряд
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
