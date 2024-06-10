"use server"

import { fetchBooks } from "../books"
import { db } from "../db"
import { validateRequest } from "../server-validate-request"

export async function getBooks() {
  const { user } = await validateRequest()

  if (!user) {
    return []
  }

  const books = await fetchBooks(user.id)
  return books
}

export async function createBook(book: {
  title: string
  pages: number
  author: string
  coverUrl?: string
  description?: string
}) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const newBook = await db.book.create({
    data: {
      title: book.title,
      pages: book.pages,
      author: book.author,
      coverUrl: book.coverUrl,
      description: book.description,
      userId: user.id,
    },
  })
  return newBook
}

export async function deleteBook(bookId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.book.delete({ where: { id: bookId, userId: user.id } })
}
