"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AreaChartIcon, BarChartIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { addDays, isSameDay, subMonths } from "date-fns"

const chartConfig = {
  desktop: {
    label: "Страниц",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function MainChart({
  events,
  profile,
}: {
  events: any[]
  profile: any
}) {
  const threeMonthsAgo = subMonths(new Date(), 3)
  const threeMonthsEvents = events.filter((event) => {
    return event.readAt > threeMonthsAgo
  })
  const chartData = []
  let day = threeMonthsAgo
  while (day <= new Date()) {
    let result = 0
    const todayEvents = threeMonthsEvents.filter((e) => {
      return isSameDay(e.readAt, day)
    })
    todayEvents.forEach((event) => {
      const bookEvents = threeMonthsEvents.filter((e) => {
        return event.bookId === e.book.id
      })
      if (bookEvents.length === 1 || bookEvents.indexOf(event) === 0) {
        result += event.pagesRead
      } else {
        const previousEventIndex = bookEvents.indexOf(event) - 1
        const previousEvent = bookEvents[previousEventIndex]
        result += event.pagesRead - previousEvent.pagesRead
      }
    })
    chartData.push({
      date: day.toISOString().split("T")[0],
      desktop: result,
    })
    day = addDays(day, 1)
  }
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  return (
    <Card className="m-2">
      <Tabs defaultValue="area">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Статистика</CardTitle>
            <CardDescription>
              Сколько страниц в день вы читали за последнее время
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 месяца
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 дней
              </SelectItem>
              {/* <SelectItem value="7d" className="rounded-lg">
              7 дней
            </SelectItem> */}
            </SelectContent>
          </Select>
          <TabsList>
            <TabsTrigger value="area">
              <AreaChartIcon className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="bar">
              <BarChartIcon className="size-4" />
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <TabsContent value="area">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("ru-RU", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("ru-RU", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="line"
                    />
                  }
                />
                <Area
                  dataKey="desktop"
                  type="monotone"
                  fill="url(#fillDesktop)"
                  stroke="var(--color-desktop)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="bar">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={filteredData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("ru-RU", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("ru-RU", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="line"
                    />
                  }
                />
                <Bar dataKey="desktop" fill={chartConfig.desktop.color} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
