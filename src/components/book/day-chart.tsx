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
  const formatChartDate = (value: Date | string | number) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return format(date, "dd.MM");
  };
  const formatTooltipDate = (
    _value: Date | string | number,
    payload?: { payload?: { date?: Date | string | number } }[],
  ) => {
    const date = payload?.[0]?.payload?.date;

    if (date === undefined) {
      return "";
    }

    const normalizedDate = new Date(date);

    if (Number.isNaN(normalizedDate.getTime())) {
      return "";
    }

    return dateToString(normalizedDate);
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={formatChartDate}
        />
        <YAxis tickLine={false} tickMargin={10} dataKey="pagesRead" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              label="date"
              labelFormatter={formatTooltipDate}
            />
          }
        />
        <Bar dataKey="pagesRead" fill="var(--color-pagesRead)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
