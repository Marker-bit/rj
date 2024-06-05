"use server"

import { fetchBooks } from "../books"
import { validateRequest } from "../server-validate-request"

export async function getBooks() {
  const { user } = await validateRequest()

  if (!user) {
    return []
  }

  const books = await fetchBooks(user.id)
  return books
}
