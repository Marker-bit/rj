import { Book } from "./api-types"
import { db } from "./db"

export async function fetchBooks(userId: string, orderBy: "percent" | "activity" = "percent") {
  const books = await db.book.findMany({
    where: {
      userId: userId,
    },
    include: {
      readEvents: {
        orderBy: [
          { pagesRead: "desc" },
          {
            readAt: "desc",
          },
        ],
      },
      collections: true,
      groupBook: {
        include: {
          group: true,
        },
      },
      links: true,
    },
  })
  const compareBooksByPercent = (a: Book, b: Book) => {
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
  const compareBooksByActivity = (a: Book, b: Book) => {
    let aTime = a.readEvents[0]?.readAt.getTime()
    let bTime = b.readEvents[0]?.readAt.getTime()

    if (aTime === undefined && bTime === undefined) return 0;
    if (aTime === undefined) return 1;
    if (bTime === undefined) return -1;

    return bTime - aTime;
  }
  books.sort(orderBy === "percent" ? compareBooksByPercent : compareBooksByActivity)
  return books
}
