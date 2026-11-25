"use client";

import { format, parseISO } from "date-fns";
import { useReadingStats, useStreakEvents } from "./streak-context";
import { ChartColumnIcon, LineChartIcon } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  desktop: {
    label: "Страниц",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export default function MainChart() {
  const events = useStreakEvents();
  const stats = useReadingStats(events);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [timeRange, setTimeRange] = useState("90d");
  const filteredData =
    stats
      ?.recentDays(timeRange === "30d" ? 30 : 90)
      .map(({ date, pagesRead }) => ({
        date: format(date, "yyyy-MM-dd"),
        desktop: pagesRead,
      })) ?? [];

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Статистика</CardTitle>
          <CardDescription>
            Сколько страниц в день вы читали за последнее время
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Период"
          >
            <SelectValue placeholder="3 месяца" />
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
        <ButtonGroup>
          <Button
            onClick={() => setChartType("line")}
            size="sm"
            variant={chartType === "line" ? "default" : "outline"}
            aria-label="Линейный график"
            aria-pressed={chartType === "line"}
          >
            <LineChartIcon />
          </Button>
          <Button
            onClick={() => setChartType("bar")}
            size="sm"
            variant={chartType === "bar" ? "default" : "outline"}
            aria-label="Столбчатая диаграмма"
            aria-pressed={chartType === "bar"}
          >
            <ChartColumnIcon />
          </Button>
        </ButtonGroup>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {chartType === "line" ? (
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
                  const date = parseISO(value);
                  return date.toLocaleDateString("ru-RU", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return parseISO(value).toLocaleDateString("ru-RU", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="line"
                  />
                }
              />
              <Area
                dataKey="desktop"
                fill="var(--color-desktop)"
                fillOpacity={0.05}
                stroke="var(--color-desktop)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          ) : (
            <BarChart data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = parseISO(value);
                  return date.toLocaleDateString("ru-RU", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return parseISO(value).toLocaleDateString("ru-RU", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="line"
                  />
                }
              />
              <Bar dataKey="desktop" fill={chartConfig.desktop.color} />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
