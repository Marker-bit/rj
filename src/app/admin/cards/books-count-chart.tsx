"use client";

import { declOfNum } from "@/lib/utils";
import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function BooksCountChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="99%" aspect={3}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tickFormatter={(date: Date) => format(date, "dd/MM")}
        />
        <YAxis dataKey="booksCount" />
        <Line
          type="monotone"
          dataKey="booksCount"
          stroke="#8884d8"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="usersCount"
          stroke="#82ca9d"
          dot={false}
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Tooltip
          labelFormatter={(date: Date) => format(date, "dd/MM")}
          content={({ active, payload, label }) =>
            active ? (
              <div className="rounded-xl border bg-white p-4 shadow-xl dark:bg-black">
                <p className="font-bold">{format(label, "dd/MM")}</p>
                <p>
                  {payload &&
                    payload[0] &&
                    payload[0].value !== undefined &&
                    typeof payload[0].value === "number" &&
                    payload[0].value +
                      " " +
                      declOfNum(payload[0].value, ["книга", "книги", "книг"])}
                </p>
                <p>
                  {payload &&
                    payload[1] &&
                    payload[1].value !== undefined &&
                    typeof payload[1].value === "number" &&
                    payload[1].value +
                      " " +
                      declOfNum(payload[1].value, [
                        "пользователь",
                        "пользователя",
                        "пользователей",
                      ])}
                </p>
              </div>
            ) : null
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
