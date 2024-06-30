"use server"

import { db } from "../db"
import { validateRequest } from "../server-validate-request"

export async function deleteQuestion(id: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.supportQuestion.delete({
    where: { id, fromUserId: user.admin ? undefined : user.id },
  })
}

export async function markAsDone(id: string, done: boolean) {
  const { user } = await validateRequest()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.supportQuestion.update({
    where: { id, fromUserId: user.admin ? undefined : user.id },
    data: { isDone: done },
  })
}
