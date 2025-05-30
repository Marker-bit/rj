import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ groupId: string; bookId: string }> }
) {
  const params = await props.params;
  const { user } = await validateRequest()

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }

  const body = await req.json()

  if (!body) {
    return new NextResponse("Bad request", {
      status: 400,
    })
  }

  if (!body.bookId) {
    return new NextResponse("Bad request", {
      status: 400,
    })
  }

  const groupBook = await db.groupBook.findFirstOrThrow({
    where: {
      id: params.bookId,
      group: {
        id: params.groupId,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    include: {
      book: true,
    },
  })

  if (groupBook.book.find((b) => b.userId === user.id)) {
    return NextResponse.json(
      { error: "Вы уже добавили себе эту книгу" },
      { status: 400 }
    )
  }

  await db.groupBook.update({
    where: {
      id: groupBook.id,
    },
    data: {
      book: {
        connect: {
          id: body.bookId,
        },
      },
    },
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
