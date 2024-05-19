import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { GroupMemberRole } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { groupId: string; memberId: string } }
) {
  const { user } = await validateRequest()

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }

  const group = await db.group.findUniqueOrThrow({
    where: {
      id: params.groupId,
      members: {
        some: {
          userId: user.id,
          role: {
            in: [GroupMemberRole.CREATOR, GroupMemberRole.MODERATOR],
          },
        },
      },
    },
    include: {
      members: true,
    },
  })

  if (!group) {
    return NextResponse.json(
      {
        error:
          "Не существует группы, вы не состоите в ней или вы не создатель и не модератор",
      },
      { status: 404 }
    )
  }

  const userMember = group.members.find((member) => member.userId === user.id)
  const member = group.members.find((member) => member.id === params.memberId)

  if (
    userMember?.role === GroupMemberRole.MODERATOR &&
    member?.role === GroupMemberRole.MODERATOR
  ) {
    return NextResponse.json(
      {
        error: "Модератор не может исключить модератора",
      },
      { status: 400 }
    )
  } else if (
    userMember?.role === GroupMemberRole.CREATOR &&
    member?.role === GroupMemberRole.CREATOR
  ) {
    return NextResponse.json(
      {
        error: "Создатель не может исключить создателя",
      },
      { status: 400 }
    )
  } else if (
    userMember?.role === GroupMemberRole.MODERATOR &&
    member?.role === GroupMemberRole.CREATOR
  ) {
    return NextResponse.json(
      {
        error: "Модератор не может исключить создателя",
      },
      { status: 400 }
    )
  }

  await db.groupMember.delete({
    where: {
      id: params.memberId,
    },
  })

  return NextResponse.json({ message: "Участник исключен" }, { status: 200 })
}
