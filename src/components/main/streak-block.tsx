"use client";

import type { ReadEvent } from "@prisma/client";
import { differenceInDays } from "date-fns";
import type { User } from "lucia";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDays2, getStreak } from "@/lib/stats";
import { declOfNum } from "@/lib/utils";
import { ConfettiButton } from "./confetti-button";

export default function StreakBlock({
  events,
}: {
  events: ReadEvent[];
  user: User;
}) {
  const { streak, breakDay, readToday } = getStreak(events);
  const days = getDays2(events);
  const pagesReadToday = days[days.length - 1].pagesRead;
  const daysSinceBreak = breakDay ? differenceInDays(new Date(), breakDay) : 0;
  const breakLabel =
    daysSinceBreak > 365
      ? "больше года"
      : daysSinceBreak > 30
        ? "больше месяца"
        : `${daysSinceBreak} ${declOfNum(daysSinceBreak, ["день", "дня", "дней"])}`;
  const goodNumbers = [
    5, 10, 20, 50, 100, 200, 300, 365, 400, 500, 600, 730, 800, 900, 1000,
  ];
  const hasntRead = events.length === 0;
  const maxPages = Math.max(...days.map((day) => day.pagesRead), 1);
  const points = days
    .map((day, index) => {
      const x = (index / Math.max(days.length - 1, 1)) * 100;
      const y = 100 - (day.pagesRead / maxPages) * 100;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <Card className="pb-0 flex overflow-hidden">
      <CardHeader>
        <CardDescription className="flex gap-2 items-center">
          Ваш стрик
        </CardDescription>
        <CardTitle className="text-3xl">
          {streak} {declOfNum(streak, ["день", "дня", "дней"])}
        </CardTitle>
        <CardDescription>
          {hasntRead ? (
            "Вы ещё ничего не прочитали"
          ) : streak > 0 ? (
            <>
              Вы читаете подряд уже{" "}
              <span className="font-bold">
                {streak} {declOfNum(streak, ["день", "дня", "дней"])}
              </span>
              {!readToday ? (
                "!"
              ) : (
                <>
                  , а сегодня прочитали{" "}
                  <span className="font-bold">
                    {pagesReadToday}{" "}
                    {declOfNum(pagesReadToday, [
                      "страницу",
                      "страницы",
                      "страниц",
                    ])}
                  </span>
                  {goodNumbers.includes(streak) && "!"}
                </>
              )}
            </>
          ) : (
            <>
              Вы не читаете уже <span className="font-bold">{breakLabel}</span>
              {" :("}
            </>
          )}
        </CardDescription>
        <CardAction>
          {(goodNumbers.includes(streak) ||
            (streak !== 0 && streak % 50 === 0)) && <ConfettiButton />}
        </CardAction>
      </CardHeader>
      <CardContent className="mt-auto h-[124px] flex-1 p-0">
        <svg
          className="size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label="Страницы, прочитанные за последние 7 дней"
        >
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="var(--primary)"
            fillOpacity={0.05}
          />
          <polyline
            points={points}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </CardContent>
    </Card>
  );
}
