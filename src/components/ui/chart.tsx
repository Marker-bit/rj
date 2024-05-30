"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

export function Chart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Bar
          dataKey="value"
          style={
            {
              fill: "hsl(var(--primary))",
              opacity: 0.9,
            } as React.CSSProperties
          }
          label
        />
        <XAxis dataKey="name" />
        <YAxis dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  )
}