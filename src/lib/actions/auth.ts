"use server";

import { hash } from "@node-rs/argon2";
import { NextResponse } from "next/server";
import { createSession, deleteSession, setSessionTokenCookie } from "../auth/sessions";
import { db } from "../db";
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
      message: "Пользователь не найден",
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
    data.book1.title === data.book2.title ||
    data.book1.title === data.book3.title ||
    data.book2.title === data.book3.title
  ) {
    return {
      error: true,
      message: "Книги не могут быть одинаковыми",
    };
  }

  function validateBook(
    book: { title: string; author: string; pages: number },
    goodBook: {
      title: string;
      author?: string | undefined;
      pages?: number | undefined;
    },
  ) {
    return book.title === goodBook.title && goodBook.author
      ? book.author === goodBook.author
      : goodBook.pages === book.pages;
  }

  const book1 = goodBooks.find((book) => validateBook(book, data.book1));
  const book2 = goodBooks.find((book) => validateBook(book, data.book2));
  const book3 = goodBooks.find((book) => validateBook(book, data.book3));

  if (!book1 || !book2 || !book3) {
    return {
      error: true,
      message: "Книги не найдены",
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

  await deleteSession(session.id);
}
