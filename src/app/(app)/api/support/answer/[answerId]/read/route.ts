import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, props: { params: Promise<{ answerId: string }> }) {
  const params = await props.params;
  const { user } = await validateRequest()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const answer = await db.supportAnswer.findFirstOrThrow({
    where: {
      id: params.answerId,
    },
    include: {
      question: true,
      read: true,
    },
  })

  if (answer.question.fromUserId !== user.id && !user.admin) {
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 401 })
  }
  if (answer.read.find((r) => r.userId === user.id)) {
    await db.answerRead.deleteMany({
      where: {
        userId: user.id,
        answerId: params.answerId,
      },
    })

    return NextResponse.json(
      { message: "Отмечено непрочитанным" },
      { status: 200 }
    )
  } else {
    await db.supportAnswer.update({
      where: {
        id: params.answerId,
      },
      data: {
        read: {
          create: {
            userId: user.id,
          },
        },
      },
    })

    return NextResponse.json(
      { message: "Отмечено прочитанным" },
      { status: 200 }
    )
  }
}
