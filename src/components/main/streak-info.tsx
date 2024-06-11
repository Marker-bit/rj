import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { StreakCounter } from "./streak-counter"
import StreakNotification from "../streak-notification"

export async function StreakInfo() {
  const { user } = await validateRequest()
  if (!user) return null

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

  if (events.length === 0) return null

  return (
    <>
      <StreakNotification events={events} user={user} />
      <StreakCounter events={events} user={user} />
    </>
  )
}
