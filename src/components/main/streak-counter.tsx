"use client";

import { getDays, getStreak, goodNumbers } from "@/lib/stats";
import { capitalizeFirstLetter, cn, declOfNum } from "@/lib/utils";
import { ReadEvent } from "@prisma/client";
import { addDays, differenceInDays, format, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";
import { User } from "lucia";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

export function StreakCounter({
  events,
  user,
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
                <div className="flex flex-col items-center gap-1">
                  <div
                    key={i}
                    className={cn(
                      "size-8 rounded-xl",
                      days[i] === 0
                        ? "bg-zinc-300 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
                        : "bg-green-300 dark:bg-green-700 border border-green-500",
                      nowDay === i && "border-4 border-black dark:border-white",
                    )}
                  />

                  <p className="text-xs md:hidden">
                    {format(
                      addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i),
                      "EEE",
                      { locale: ru },
                    ).slice(0, 2)}
                  </p>
                  <p className="text-xs md:hidden">{days[i]}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-300 dark:bg-green-700">
                    {days[i]}
                  </div>

                  {capitalizeFirstLetter(
                    format(
                      addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i),
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
