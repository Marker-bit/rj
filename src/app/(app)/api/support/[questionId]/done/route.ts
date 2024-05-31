import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const { user } = await validateRequest()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const question = await db.supportQuestion.findFirstOrThrow({
    where: {
      id: params.questionId,
    },
  })

  if (question.fromUserId !== user.id && !user.admin) {
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 401 })
  }

  await db.supportQuestion.update({
    where: {
      id: params.questionId,
    },
    data: {
      isDone: !question.isDone,
    },
  })

  return NextResponse.json({ message: "Вопрос закрыт" }, { status: 200 })
}
