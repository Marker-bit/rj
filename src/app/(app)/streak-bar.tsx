import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { StreakButton } from "./streak-button"

export async function StreakBar() {
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

  return <StreakButton events={events} />
}
