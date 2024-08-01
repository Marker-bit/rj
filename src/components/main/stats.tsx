import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { BarChart } from "lucide-react"
import MainChart from "./main-chart"
import { addDays, isSameDay, subMonths } from "date-fns"

export async function Stats() {
  const { user } = await validateRequest()
  if (!user) return
  const profile = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      follower: true,
      following: true,
    },
  })
  const events = await db.readEvent.findMany({
    where: {
      book: {
        userId: user.id,
      },
    },
    include: {
      book: true,
    },
    orderBy: {
      readAt: "asc",
    },
  })
  return <MainChart events={events} profile={profile} />
}
