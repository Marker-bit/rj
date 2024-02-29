import { db } from "./db";

export async function fetchBooks(userId: string) {
  const books = await db.book.findMany({
    where: {
      userId: userId,
    },
    include: {
      readEvents: {
        orderBy: {
          readAt: "desc",
        },
      },
      collections: true,
    },
  });
  const compareBooks = (a: any, b: any) => {
    const aPages = a.readEvents[a.readEvents.length - 1]?.pagesRead;
    const bPages = b.readEvents[b.readEvents.length - 1]?.pagesRead;
    if (!aPages && !bPages) return 0;
    if (!aPages) return 1;
    if (!bPages) return -1;
    if (aPages > bPages) return -1;
    if (aPages == bPages) return 0;
    if (aPages < bPages) return 1;
    return 0;
  };
  books.sort(compareBooks);
  return books;
}
