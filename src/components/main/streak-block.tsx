"use client";

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
import { ReadEvent } from "@prisma/client";
import { differenceInDays } from "date-fns";
import { User } from "lucia";
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
  const goodNumbers = [5, 10, 20, 50, 100, 200, 365, 500, 730, 1000];

  return (
    <Card className="pb-0 lg:hidden xl:flex overflow-hidden">
      <CardHeader>
        <CardDescription className="flex gap-2 items-center">
          Ваш стрик
        </CardDescription>
        <CardTitle className="text-3xl">
          {streak} {declOfNum(streak, ["день", "дня", "дней"])}
        </CardTitle>
        <CardDescription>
          {streak > 0 ? (
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
          {goodNumbers.includes(streak) && <ConfettiButton />}
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
    // <Card>
    //   <CardHeader>
    //     <CardTitle className="flex items-center gap-2">
    //     </CardTitle>
    //     <CardDescription>
    //       {streak > 0 ? (
    //         <>
    //           Вы читаете подряд уже{" "}
    //           <span className="font-bold">
    //             {streak} {declOfNum(streak, ["день", "дня", "дней"])}
    //           </span>
    //           , а сегодня прочитали{" "}
    //           <span className="font-bold">
    //             {days[days.length - 1].pagesRead}{" "}
    //             {declOfNum(days[days.length - 1].pagesRead, [
    //               "страницу",
    //               "страницы",
    //               "страниц",
    //             ])}
    //           </span>
    //           {goodNumbers.includes(streak) && "!"}
    //         </>
    //       ) : (
    //         <>
    //           Вы не читаете уже{" "}
    //           <span className="font-bold">
    //             {differenceInDays(new Date(), breakDay)}{" "}
    //             {declOfNum(differenceInDays(new Date(), breakDay), [
    //               "день",
    //               "дня",
    //               "дней",
    //             ])}
    //           </span>
    //         </>
    //       )}
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent className="flex flex-row items-baseline gap-4">
    //     <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
    //       {streak}
    //       <span className="text-sm font-normal text-muted-foreground">
    //         {declOfNum(streak, ["день", "дня", "дней"])}
    //       </span>
    //     </div>
    //     <div className="ml-auto flex items-end gap-2">
    //       <ChartContainer
    //         config={{
    //           pagesRead: {
    //             label: "Страниц",
    //             color: "var(--chart-1)",
    //           },
    //         }}
    //         className="w-[72px]"
    //       >
    //         <BarChart
    //           accessibilityLayer
    //           margin={{
    //             left: 0,
    //             right: 0,
    //             top: 0,
    //             bottom: 0,
    //           }}
    //           data={days}
    //         >
    //           <Bar
    //             dataKey="pagesRead"
    //             fill="var(--color-pagesRead)"
    //             radius={2}
    //             fillOpacity={0.2}
    //             activeIndex={6}
    //             activeBar={<Rectangle fillOpacity={0.8} />}
    //           />
    //           <XAxis
    //             dataKey="date"
    //             tickLine={false}
    //             axisLine={false}
    //             tickMargin={4}
    //             hide
    //           />
    //         </BarChart>
    //       </ChartContainer>
    //       {goodNumbers.includes(streak) && <ConfettiButton />}
    //     </div>
    //   </CardContent>
    // </Card>
  );
}
