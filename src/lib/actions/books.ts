"use server";

import { BackgroundColor } from "@prisma/client";
import { fetchBooks } from "../books";
import { db } from "../db";
import { validateRequest } from "../server-validate-request";
import { z } from "zod";

export async function getBooks(orderBy: "percent" | "activity" = "percent", mainPage: boolean = false) {
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

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  fields: z.array(
    z.object({
      title: z.string({ required_error: "Название поля обязательно" }),
      value: z.string({
        required_error: "Значение поля обязательно",
      }),
    })
  ),
});

export async function createBook(book: {
  title: string;
  pages: number;
  author: string;
  coverUrl?: string;
  description?: string;
  fields: {
    title: string;
    value: string;
  }[];
}) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const data = bookSchema.safeParse(book);
  if (!data.success) {
    throw new Error(data.error.errors.map((e) => e.message).join("\n"));
  }

  const newBook = await db.book.create({
    data: {
      title: book.title,
      pages: book.pages,
      author: book.author,
      coverUrl: book.coverUrl,
      description: book.description,
      userId: user.id,
      fields: book.fields,
    },
  });
  return newBook;
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
