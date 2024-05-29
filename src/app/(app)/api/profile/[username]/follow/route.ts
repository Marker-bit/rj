import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const { user: currentUser } = await validateRequest()

  if (!currentUser) {
    return new NextResponse("Not Authorized", {
      status: 401,
    })
  }

  const user = await db.user.findFirst({
    where: {
      username: params.username,
    },
  })

  if (!user) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 }
    )
  }

  if (user.id === currentUser.id) {
    return NextResponse.json(
      { error: "Нельзя подписаться на себя" },
      { status: 400 }
    )
  }

  const follow = await db.follow.create({
    data: {
      firstId: currentUser.id,
      secondId: user.id,
    },
  })

  return NextResponse.json({ message: `Вы подписались на @${user.username}` })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const { user: currentUser } = await validateRequest()

  if (!currentUser) {
    return new NextResponse("Not Authorized", {
      status: 401,
    })
  }

  const user = await db.user.findFirst({
    where: {
      username: params.username,
    },
  })

  if (!user) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 }
    )
  }

  await db.follow.deleteMany({
    where: {
      firstId: currentUser.id,
      secondId: user.id,
    },
  })

  return NextResponse.json({ message: `Вы отписались от @${user.username}` })
}
