"use server";

import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lucia } from "../auth";
import { db } from "../db";
import { checkRateLimit } from "../rate-limit";
import { validateRequest } from "../server-validate-request";

export async function resetPassword(data: {
  username: string;
  password: string;
  book1: {
    title: string;
    author?: string | undefined;
    pages?: number | undefined;
  };
  book2: {
    title: string;
    author?: string | undefined;
    pages?: number | undefined;
  };
  book3: {
    title: string;
    author?: string | undefined;
    pages?: number | undefined;
  };
}) {
  const rateLimit = checkRateLimit(`reset:${data.username}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.ok) {
    const minutes = Math.max(1, Math.ceil(rateLimit.retryAfterMs / 60_000));
    return {
      error: true,
      message: `Слишком много попыток. Попробуйте снова через ${minutes} мин.`,
    };
  }

  const user = await db.user.findUnique({
    where: {
      username: data.username,
    },
    include: {
      books: true,
    },
  });
  if (!user) {
    return {
      error: true,
      message: "Не удалось подтвердить данные аккаунта",
    };
  }

  const goodBooks = user.books.filter((book) => book.groupBookId === null); // книги не в группе

  if (goodBooks.length < 3) {
    return {
      error: true,
      message: "Недостаточно книг для смены пароля",
    };
  }

  if (
    normalize(data.book1.title) === normalize(data.book2.title) ||
    normalize(data.book1.title) === normalize(data.book3.title) ||
    normalize(data.book2.title) === normalize(data.book3.title)
  ) {
    return {
      error: true,
      message: "Книги не могут быть одинаковыми",
    };
  }

  function normalize(value: string) {
    return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("ru");
  }

  function validateBook(
    book: { title: string; author: string; pages: number },
    goodBook: {
      title: string;
      author?: string | undefined;
      pages?: number | undefined;
    },
  ) {
    return (
      normalize(book.title) === normalize(goodBook.title) &&
      (goodBook.author
        ? normalize(book.author) === normalize(goodBook.author)
        : goodBook.pages === book.pages)
    );
  }

  const book1 = goodBooks.find((book) => validateBook(book, data.book1));
  const book2 = goodBooks.find((book) => validateBook(book, data.book2));
  const book3 = goodBooks.find((book) => validateBook(book, data.book3));

  const matches = [book1, book2, book3];
  if (!book1 || !book2 || !book3) {
    return {
      error: true,
      message: "Не удалось подтвердить данные аккаунта",
      failedBooks: matches.flatMap((book, index) => (book ? [] : [index + 1])),
    };
  }

  if (data.password.length < 8) {
    return {
      error: true,
      message: "Пароль должен содержать минимум 8 символов",
    };
  }

  const hashedPassword = await hash(data.password);

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      hashedPassword,
    },
  });

  await db.session.deleteMany({ where: { userId: user.id } });

  return {
    error: false,
  };
}

export async function logOut() {
  const { session } = await validateRequest();
  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
