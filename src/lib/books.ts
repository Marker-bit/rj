import type { Book } from "./api-types";
import { db } from "./db";

type FetchBooksOptions =
  | {
      orderBy: "percent" | "activity";
    }
  | { history: true };

export async function fetchBooks(
  userId: string,
  options: FetchBooksOptions = { orderBy: "percent" },
) {
  const isHistory = "history" in options;
  let books = await db.book.findMany({
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
  });
  const compareBooksByPercent = (a: Book, b: Book) => {
    let aPages = a.readEvents[0]?.pagesRead;
    let bPages = b.readEvents[0]?.pagesRead;
    if (!aPages && !bPages) return 0;
    if (!aPages) return 1;
    if (!bPages) return -1;
    aPages = aPages / a.pages;
    bPages = bPages / b.pages;
    if (aPages > bPages) return -1;
    if (aPages === bPages) return 0;
    if (aPages < bPages) return 1;
    return 0;
  };
  const compareBooksByActivity = (a: Book, b: Book) => {
    const aTime = a.readEvents[0]?.readAt.getTime() || a.createdAt.getTime();
    const bTime = b.readEvents[0]?.readAt.getTime() || a.createdAt.getTime();

    if (aTime === undefined && bTime === undefined) return 0;
    if (aTime === undefined) return 1;
    if (bTime === undefined) return -1;

    return bTime - aTime;
  };
  books = books.filter((b) =>
    isHistory
      ? b.readEvents.find((e) => e.pagesRead === b.pages)
      : !b.readEvents.find((e) => e.pagesRead === b.pages),
  );
  books.sort(
    isHistory
      ? compareBooksByActivity
      : options.orderBy === "percent"
        ? compareBooksByPercent
        : compareBooksByActivity,
  );
  return books;
}

export async function fetchBook(id: string, userId?: string) {
  return db.book.findUnique({
    where: {
      id,
      userId: userId || undefined,
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
  });
}

export async function getLastReadBook(userId: string) {
  const readEvents = await db.readEvent.findMany({
    where: {
      book: {
        userId: userId,
      },
    },
    include: {
      book: true,
    },
    orderBy: {
      readAt: "desc",
    },
  });
  const books: string[] = [];
  for (const readEvent of readEvents) {
    if (
      readEvent.book.pages !== readEvent.pagesRead &&
      !books.includes(readEvent.book.id)
    ) {
      return { book: readEvent.book, pages: readEvent.pagesRead };
    }
    books.push(readEvent.book.id);
  }

  return null;
}
