import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const { user } = await validateRequest()

  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    })
  }

  const bookId = params.bookId

  const data = await req.json()

  if (!data.color) {
    return NextResponse.json({ error: "Цвет не указан" }, { status: 400 })
  }

  const updateBook = await db.book.update({
    where: {
      id: bookId,
      userId: user.id,
    },
    data: {
      background: data.color,
    },
  })

  return NextResponse.json({ message: "Цвет изменен" }, { status: 200 })
}
