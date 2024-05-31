import { db } from "@/lib/db";
import { addDays, endOfMonth, isAfter, isSameDay, startOfMonth } from "date-fns";
import UsersCountChart from "./users-count-chart";

export default async function UsersCountInfo() {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const users = await db.user.findMany({
    where: {
      registeredAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  })
  const days: { date: Date; count: number }[] = []
  for (let i = monthStart; i <= monthEnd; i = addDays(i, 1)) {
    if (isAfter(i, now)) break
    days.push({ date: i, count: 0 })
  }
  users.forEach((user) => {
    const date = new Date(user.registeredAt)
    const index = days.findIndex((d) => isSameDay(d.date, date))
    if (index !== -1) {
      days[index].count += 1
    }
  })
  return (
    <div className="col-span-3 rounded-xl border p-4">
      <div className="mb-2 font-bold">Пользователи за месяц</div>
      <UsersCountChart data={days} />
    </div>
  )
}
