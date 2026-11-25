import type { Prisma } from "@/generated/prisma/client";
import { db } from "./db";

export async function lockOwnedBook(
  tx: Prisma.TransactionClient,
  { bookId, userId }: { bookId: string; userId: string },
) {
  const [book] = await tx.$queryRaw<{ pages: number }[]>`
    SELECT pages FROM "Book" WHERE id = ${bookId} AND "userId" = ${userId}
    FOR UPDATE
  `;
  return book;
}

export function recordReadingProgress({
  bookId,
  userId,
  pagesRead,
  readAt,
}: {
  bookId: string;
  userId: string;
  pagesRead: number;
  readAt: Date;
}) {
  return db.$transaction(async (tx) => {
    const book = await lockOwnedBook(tx, { bookId, userId });
    if (!book) return { kind: "not-found" } as const;
    if (pagesRead > book.pages) {
      return { kind: "out-of-range", pages: book.pages } as const;
    }
    const event = await tx.readEvent.create({
      data: { bookId, pagesRead, readAt },
    });
    return { kind: "created", event } as const;
  });
}
