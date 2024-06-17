import { Book, PromiseMode, ReadEvent, ReadPromise } from "@prisma/client"
import { db } from "./db"
import {
  addDays,
  differenceInDays,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns"

export async function getPromises() {}

export async function getPromiseProgress(
  promise: ReadPromise & { books: { id: string }[] }
) {
  const startDate = startOfDay(promise.startDate)
  const dueDate = startOfDay(promise.dueDate)

  if (promise.mode === PromiseMode.FULL_BOOKS) {
    const events = await db.readEvent.findMany({
      where: {
        readAt: {
          gte: startDate,
          lte: dueDate,
        },
        book: {
          userId: promise.userId,
          id: {
            in: promise.books.map((book) => book.id),
          },
        },
      },
      include: {
        book: true,
      },
    })
    const fullEvents = events.filter(
      (event) => event.pagesRead === event.book.pages
    )
    const books: Book[] = []

    for (const event of events) {
      if (!books.find((book) => book.id === event.bookId))
        books.push(event.book)
    }

    return {
      progress: fullEvents.length,
      total: promise.books.length,
      mode: PromiseMode.FULL_BOOKS,
    }
  } else if (promise.mode === PromiseMode.READ_PAGES) {
    const events = await db.readEvent.findMany({
      where: {
        // bookId:
        //   promise.books.length > 0
        //     ? {
        //         in: promise.books.map((book) => book.id),
        //       }
        //     : undefined,
        book: {
          userId: promise.userId,
        },
      },
    })
    let totalPages = 0
    events.forEach((event) => {
      if (isBefore(event.readAt, startDate) || isAfter(event.readAt, dueDate))
        return
      const sameBookEvents = events.filter((e) => e.bookId === event.bookId)
      const eventIndex = sameBookEvents.indexOf(event)
      const previousEvent = sameBookEvents[eventIndex - 1]
      const pagesDifference = event.pagesRead - (previousEvent?.pagesRead || 0)

      totalPages += pagesDifference
    })
    return {
      progress: totalPages,
      total: promise.pagesCount!,
      mode: PromiseMode.READ_PAGES,
    }
  } else {
    const events = await db.readEvent.findMany({
      where: {
        book: {
          userId: promise.userId,
        },
      },
    })
    let currentDay = startDate

    while (isBefore(currentDay, dueDate)) {
      const todayEvents = events.filter((e) => isSameDay(e.readAt, currentDay))
      if (!todayEvents.length) {
        break
      }
      console.log(currentDay, dueDate, startDate, todayEvents)

      let totalRead = 0

      for (const event of todayEvents) {
        const sameBookEvents = events.filter((e) => e.bookId === event.bookId)
        const eventIndex = sameBookEvents.indexOf(event)
        const previousEvent = sameBookEvents[eventIndex - 1]
        const pagesDifference =
          event.pagesRead - (previousEvent?.pagesRead || 0)

        totalRead += pagesDifference
      }

      if (totalRead < promise.streakPages!) {
        break
      }
      currentDay = addDays(currentDay, 1)
    }
    return {
      progress: differenceInDays(currentDay, startDate),
      total: differenceInDays(dueDate, startDate),
      breakDay: isSameDay(currentDay, addDays(dueDate, 1)) ? null : currentDay,
      mode: PromiseMode.STREAK,
    }
  }
}
