import { db } from "./db"

export async function fetchBooks(
  userId: string,
  offset?: number,
  limit?: number,
  hideNotStarted?: boolean
) {
  const books = await db.book.findMany({
    where: {
      userId: userId,
      readEvents: {},
    },
    include: {
      readEvents: {
        orderBy: {
          readAt: "desc",
        },
      },
      collections: true,
      groupBook: {
        include: {
          group: true,
        },
      },
      links: {
        include: {
          book: true,
        },
      },
    },
    skip: offset,
    take: limit,
  })
  const compareBooks = (a: any, b: any) => {
    let aPages = a.readEvents[0]?.pagesRead
    let bPages = b.readEvents[0]?.pagesRead
    if (!aPages && !bPages) return 0
    if (!aPages) return 1
    if (!bPages) return -1
    aPages = aPages / a.pages
    bPages = bPages / b.pages
    if (aPages > bPages) return -1
    if (aPages == bPages) return 0
    if (aPages < bPages) return 1
    return 0
  }
  books.sort(compareBooks)
  return books
}
