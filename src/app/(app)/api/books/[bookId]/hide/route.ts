import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, props: { params: Promise<{ bookId: string }> }) {
  const params = await props.params;
  const { user } = await validateRequest()

  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    })
  }

  const book = await db.book.findUniqueOrThrow({
    where: {
      id: params.bookId,
      userId: user.id,
    },
    select: {
      id: true,
      isHidden: true,
    },
  })

  if (!book) {
    return new NextResponse(null, {
      status: 400,
    })
  }

  await db.book.update({
    where: {
      id: book.id,
    },
    data: {
      isHidden: !book.isHidden,
    },
  })

  return NextResponse.json({ ok: true })
}
