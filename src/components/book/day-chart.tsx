"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { format, subDays } from "date-fns";

export const description = "A bar chart"

const chartData = [
  { date: subDays(new Date(), 1), pagesRead: 100 },
  { date: new Date(), pagesRead: 186 },
  // { month: "February", pagesRead: 305 },
  // { month: "March", pagesRead: 237 },
  // { month: "April", pagesRead: 73 },
  // { month: "May", pagesRead: 209 },
  // { month: "June", pagesRead: 214 },
]

const chartConfig = {
  pagesRead: {
    label: "Страниц прочитано",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function DayChart({data}: {data: {date: Date, pagesRead: number}[]}) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: Date) => format(value, "dd.MM")}
        />
        <YAxis
          tickLine={false}
          tickMargin={10}
          dataKey="pagesRead"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="pagesRead" fill="var(--color-pagesRead)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
