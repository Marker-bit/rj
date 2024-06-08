import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import Event from "./event"
import Pagination from "./pagination"
import { Book, ReadEvent, User } from "@prisma/client"
import EventRepeat from "./event-repeat"
import { ReactElement } from "react"

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
  let components: ReactElement[] = []
  let tempArray: (ReadEvent & { book: Book & { user: User } })[] = []

  activity.forEach((event, index) => {
    tempArray.push(event)
    // Check if the current event's type does not match the next event's type or if it's the last event
    if (
      index === activity.length - 1 ||
      event.bookId !== activity[index + 1].bookId
    ) {
      if (tempArray.length > 2) {
        components.push(<EventRepeat key={event.id} events={tempArray} />)
      } else {
        components.push(<Event key={event.id} event={tempArray[0]} />)
      }
      tempArray = [] // Reset tempArray for the next sequence
    }
  })
  return (
    <div className="mb-[15vh] flex flex-col gap-2 p-2">
      {/* {activity.map((event) => (
        <Event key={event.id} event={event} />
      ))} */}
      {components}
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}
