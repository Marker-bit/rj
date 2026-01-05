"use client";

import { format, subDays } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { dateToString } from "@/lib/utils";

export const description = "A bar chart";

const _chartData = [
  { date: subDays(new Date(), 1), pagesRead: 100 },
  { date: new Date(), pagesRead: 186 },
  // { month: "February", pagesRead: 305 },
  // { month: "March", pagesRead: 237 },
  // { month: "April", pagesRead: 73 },
  // { month: "May", pagesRead: 209 },
  // { month: "June", pagesRead: 214 },
];

const chartConfig = {
  pagesRead: {
    label: "Страниц прочитано",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function DayChart({
  data,
}: {
  data: { date: Date; pagesRead: number }[];
}) {
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
        <YAxis tickLine={false} tickMargin={10} dataKey="pagesRead" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              label="date"
              labelFormatter={(value: Date) => dateToString(value)}
            />
          }
        />
        <Bar dataKey="pagesRead" fill="var(--color-pagesRead)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
