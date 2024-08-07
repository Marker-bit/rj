"use server"

import { BackgroundColor } from "@prisma/client"
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

export async function setBookColor(bookId: string, color: BackgroundColor) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.book.update({
    where: { id: bookId, userId: user.id },
    data: { background: color },
  })
}

export async function deleteBookLink(linkId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.bookLink.delete({ where: { id: linkId, book: { userId: user.id } } })

  return {
    error: false
  }
}
