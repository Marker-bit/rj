"use server";

import type { BackgroundColor } from "@/generated/prisma/enums";
import { prettifyError, z } from "zod";
import { defaultBookOrder, type BookOrder } from "../book-order";
import { fetchBooks } from "../books";
import { db } from "../db";
import { validateRequest } from "../server-validate-request";
import { bookSchema } from "../validation/schemas";

export async function getBooks(
  orderBy: BookOrder = defaultBookOrder,
  mainPage: boolean = false,
) {
  const { user } = await validateRequest();

  if (!user) {
    return [];
  }

  const books = await fetchBooks(user.id, { orderBy });

  if (mainPage) {
    return books.slice(0, 3);
  }
  return books;
}

const normalizeBookName = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLowerCase();

class DuplicateLookupError extends Error {}

export async function createBook(
  book: z.input<typeof bookSchema>,
  mode?: "add-anyway",
) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = bookSchema.safeParse(book);
  if (!data.success) {
    throw new Error(prettifyError(data.error));
  }

  const bookData = { ...data.data, userId: user.id };
  if (mode === "add-anyway") {
    await db.book.create({ data: bookData });
    return { kind: "created" } as const;
  }

  const title = normalizeBookName(bookData.title);
  const author = normalizeBookName(bookData.author);

  try {
    return await db.$transaction(
      async (tx) => {
        const books = await tx.book
          .findMany({
            where: { userId: user.id },
            select: {
              id: true,
              title: true,
              author: true,
              pages: true,
              status: true,
            },
            orderBy: [{ status: "asc" }, { createdAt: "desc" }, { id: "asc" }],
          })
          .catch((cause: unknown) => {
            throw new DuplicateLookupError("Book duplicate lookup failed", {
              cause,
            });
          });
        const matches = books.filter(
          (existing) =>
            normalizeBookName(existing.title) === title &&
            normalizeBookName(existing.author) === author,
        );

        if (matches.length > 0) {
          return { kind: "duplicate", matches } as const;
        }

        await tx.book.create({ data: bookData });
        return { kind: "created" } as const;
      },
      { isolationLevel: "Serializable" },
    );
  } catch (error) {
    if (error instanceof DuplicateLookupError) {
      console.error(error);
      return { kind: "lookup-failed" } as const;
    }
    throw error;
  }
}

export async function deleteBook(bookId: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.book.delete({ where: { id: bookId, userId: user.id } });
}

export async function setBookColor(bookId: string, color: BackgroundColor) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.book.update({
    where: { id: bookId, userId: user.id },
    data: { background: color },
  });
}

export async function deleteBookLink(linkId: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.bookLink.delete({
    where: { id: linkId, book: { userId: user.id } },
  });

  return {
    error: false,
  };
}

export async function saveBookFromRec(recId: string) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: "Не авторизован" };
  }

  const rec = await db.recommendation.findFirstOrThrow({
    where: { id: recId },
  });

  if (!rec) {
    return { error: "Рекомендация не найдена" };
  }

  const book = await db.book.create({
    data: {
      title: rec.title,
      author: rec.author,
      pages: rec.pages,
      coverUrl: rec.coverUrl,
      description: rec.description,
      userId: user.id,
      fromRecommendationId: rec.id,
    },
  });

  return { id: book.id };
}
