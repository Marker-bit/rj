import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { user } = await validateRequest()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const data = await req.json()
  const title = data.title
  if (!title) {
    return NextResponse.json({ error: "Название не указано" }, { status: 400 })
  }
  const content = data.content
  if (!content) {
    return NextResponse.json(
      { error: "Содержание не указано" },
      { status: 400 }
    )
  }

  const question = await db.supportQuestion.create({
    data: {
      title,
      content,
      fromUserId: user.id,
    },
  })

  return NextResponse.json({ message: "Вопрос отправлен" }, { status: 200 })
}
