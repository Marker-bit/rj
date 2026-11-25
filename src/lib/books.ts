import type { Prisma } from "@/generated/prisma/client";
import { BookStatus } from "@/generated/prisma/enums";
import { defaultBookOrder, sortBooks, type BookOrder } from "./book-order";
import { db } from "./db";

const bookListSelect = {
  id: true,
  title: true,
  author: true,
  pages: true,
  createdAt: true,
  description: true,
  coverUrl: true,
  background: true,
  status: true,
  fields: true,
  userId: true,
  groupBookId: true,
  fromRecommendationId: true,
  readEvents: {
    select: {
      id: true,
      pagesRead: true,
      readAt: true,
    },
    orderBy: [
      { pagesRead: "desc" },
      {
        readAt: "desc",
      },
    ],
  },
  collections: {
    select: {
      id: true,
      name: true,
      icon: true,
      color: true,
    },
  },
  groupBook: {
    select: {
      id: true,
      groupId: true,
      group: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  },
  links: {
    select: {
      id: true,
    },
  },
} satisfies Prisma.BookSelect;

type FetchBooksOptions =
  | {
      orderBy: BookOrder;
      all?: boolean;
    }
  | { history: true }
  | { archive: true };

export async function fetchBooks(
  userId: string,
  options: FetchBooksOptions = { orderBy: defaultBookOrder },
) {
  const isHistory = "history" in options;
  const isArchive = "archive" in options;
  const all = !isHistory && !isArchive && options.all;
  const books = await db.book.findMany({
    where: {
      userId: userId,
      status: all
        ? undefined
        : isArchive
          ? BookStatus.ARCHIVED
          : {
              not: BookStatus.ARCHIVED,
            },
    },
    select: bookListSelect,
  });
  const matchingBooks =
    isArchive || all
      ? books
      : books.filter(
          (book) =>
            book.readEvents.some((event) => event.pagesRead === book.pages) ===
            isHistory,
        );

  return sortBooks(
    matchingBooks,
    isHistory || isArchive ? "activity" : options.orderBy,
  );
}

export async function fetchBookTag({
  tagId,
  userId,
}: {
  tagId: string;
  userId: string;
}) {
  return db.collection.findUnique({
    where: { id: tagId, userId },
    select: {
      name: true,
      icon: true,
      color: true,
      books: {
        where: { userId },
        select: {
          ...bookListSelect,
          collections: { ...bookListSelect.collections, where: { userId } },
        },
      },
    },
  });
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
      book: {
        include: {
          readEvents: {
            orderBy: {
              readAt: "desc",
            },
          },
        },
      },
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
