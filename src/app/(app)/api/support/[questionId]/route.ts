import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, props: { params: Promise<{ questionId: string }> }) {
  const params = await props.params;
  const { user } = await validateRequest()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const data = await req.json()
  const content = data.content
  if (!content) {
    return NextResponse.json(
      { error: "Содержание не указано" },
      { status: 400 }
    )
  }

  const question = await db.supportQuestion.findFirstOrThrow({
    where: {
      id: params.questionId,
    },
  })

  if (question.fromUserId !== user.id && !user.admin) {
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 401 })
  }

  await db.supportAnswer.create({
    data: {
      content,
      questionId: params.questionId,
      fromUserId: user.id,
      read: {
        create: {
          userId: user.id,
        }
      }
    },
  })

  return NextResponse.json({ message: "Ответ отправлен" }, { status: 200 })
}
