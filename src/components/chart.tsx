"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

export function Chart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Bar
          dataKey="value"
          style={
            {
              fill: "black",
              opacity: 0.9,
            } as React.CSSProperties
          }
          label
        />
        <XAxis dataKey="name" />
      </BarChart>
    </ResponsiveContainer>
  );
}
