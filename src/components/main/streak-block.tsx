"use client";

import type { ReadEvent } from "@prisma/client";
import { differenceInDays } from "date-fns";
import type { User } from "lucia";
import { Area, AreaChart } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
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
  const goodNumbers = [
    5, 10, 20, 50, 100, 200, 300, 365, 400, 500, 600, 730, 800, 900, 1000,
  ];
  const hasntRead = events.length === 0;

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
              Вы не читаете уже{" "}
              <span className="font-bold">
                {differenceInDays(new Date(), breakDay)}{" "}
                {declOfNum(differenceInDays(new Date(), breakDay), [
                  "день",
                  "дня",
                  "дней",
                ])}
              </span>
              {" :("}
            </>
          )}
        </CardDescription>
        <CardAction>
          {(goodNumbers.includes(streak) ||
            (streak !== 0 && streak % 50 === 0)) && <ConfettiButton />}
        </CardAction>
      </CardHeader>
      <CardContent className="mt-auto max-h-[124px] flex-1 p-0">
        <ChartContainer
          config={{
            pagesRead: {
              label: "Страниц прочитано",
              color: "var(--primary)",
            },
          }}
          className="size-full"
        >
          <AreaChart
            data={days}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <Area
              dataKey="pagesRead"
              fill="var(--color-pagesRead)"
              fillOpacity={0.05}
              stroke="var(--color-pagesRead)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
