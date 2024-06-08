import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import Event from "./event"
import Pagination from "./pagination"

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { user } = await validateRequest()
  if (!user) return null
  let page = searchParams?.page ? parseInt(searchParams.page as string) : 1
  const pageSize = 10
  if (page < 1) {
    page = 1
  }
  const fullCount = await db.readEvent.count({
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
  })
  const totalPages = Math.ceil(fullCount / pageSize)
  if (page > totalPages) {
    page = totalPages
  }
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
    skip: (page - 1) * pageSize,
    take: pageSize,
  })
  return (
    <div className="mb-[15vh] flex flex-col gap-2 p-2">
      {activity.map((event) => (
        <Event key={event.id} event={event} />
      ))}
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}
