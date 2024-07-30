"use client"

import { Bar, BarChart, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ReadEvent } from "@prisma/client"
import { getDays, getDays2, getStreak } from "@/lib/stats"
import { declOfNum } from "@/lib/utils"
import { User } from "lucia"
import { ConfettiButton } from "./confetti-button"
import { Star } from "lucide-react"

export default function StreakBlock({
  events,
}: {
  events: ReadEvent[]
  user: User
}) {
  const streak = getStreak(events)
  const days = getDays2(events)
  const goodNumbers = [2, 5, 10, 20, 50, 100, 200, 365, 500, 730, 1000]

  if (streak === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center gap-2">
          {goodNumbers.includes(streak) ? (
            <>
              <Star className="size-6" />
              Поздравляем!
            </>
          ) : (
            "Чтение подряд"
          )}
        </CardTitle>
        <CardDescription>
          Вы читаете подряд уже{" "}
          <span className="font-bold">
            {streak} {declOfNum(streak, ["день", "дня", "дней"])}
          </span>
          , а сегодня прочитали{" "}
          <span className="font-bold">
            {days[days.length - 1].pagesRead}{" "}
            {declOfNum(days[days.length - 1].pagesRead, [
              "страницу",
              "страницы",
              "страниц",
            ])}
          </span>
          {goodNumbers.includes(streak) && "!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
          {streak}
          <span className="text-sm font-normal text-muted-foreground">
            {declOfNum(streak, ["день", "дня", "дней"])}
          </span>
        </div>
        <div className="ml-auto flex items-end gap-2">
          <ChartContainer
            config={{
              pagesRead: {
                label: "Страниц",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="w-[72px]"
          >
            <BarChart
              accessibilityLayer
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              data={days}
            >
              <Bar
                dataKey="pagesRead"
                fill="var(--color-pagesRead)"
                radius={2}
                fillOpacity={0.2}
                activeIndex={6}
                activeBar={<Rectangle fillOpacity={0.8} />}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                hide
              />
            </BarChart>
          </ChartContainer>
          <ConfettiButton />
        </div>
      </CardContent>
    </Card>
  )
}
