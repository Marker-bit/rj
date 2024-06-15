"use server"

import { PromiseMode, ReadPromise } from "@prisma/client"
import { validateRequest } from "../server-validate-request"
import { db } from "../db"

export async function createPromise(promise: {
  books?: string[]
  pagesCount?: number
  streakPages?: number
  dueDate: Date
  mode: PromiseMode
}) {
  const { user } = await validateRequest()
  if (!user) {
    return null
  }

  const createdPromise = await db.readPromise.create({
    data: {
      ...promise,
      userId: user.id,
      books: promise.books && { connect: promise.books.map((id) => ({ id })) },
    },
  })

  return createdPromise
}
