import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import Event from "./event"

export default async function Page() {
  const { user } = await validateRequest()
  if (!user) return null
  const activity = await db.readEvent.findMany({
    where: {
      book: {
        user: {
          follower: {
            some: {
              second: {
                id: user.id,
              },
            },
          },
        },
      },
    },
    include: {
      book: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      readAt: "desc",
    },
  })
  return (
    <div className="flex flex-col gap-2 p-2">
      {activity.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </div>
  )
}
