"use client";

import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { dateToString } from "@/lib/utils";

export const description = "A bar chart";

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
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.date),
  }));

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: Date | string | number) =>
            format(new Date(value), "dd.MM")
          }
        />
        <YAxis tickLine={false} tickMargin={10} dataKey="pagesRead" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              label="date"
              labelFormatter={(value: Date | string | number) =>
                dateToString(new Date(value))
              }
            />
          }
        />
        <Bar dataKey="pagesRead" fill="var(--color-pagesRead)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
