import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { GroupMemberRole } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
export async function POST(
  req: NextRequest,
  { params }: { params: { groupId: string; suggestionId: string } }
) {
  const { user } = await validateRequest()
  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }
  const { groupId, suggestionId } = params
  const suggestion = await db.groupBookSuggestion.findUniqueOrThrow({
    where: {
      id: suggestionId,
    },
  })
  const group = await db.group.findFirst({
    where: {
      id: groupId,
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
    }
  })
  if (!group) {
    return NextResponse.json(
      { error: "Не существует группы, или вы не создатель и не модератор" },
      { status: 404 }
    )
  }
  const member = group.members.find((member) => member.userId === user.id)

  if (!member) {
    return NextResponse.json(
      { error: "Вы не состоите в этой группе" },
      { status: 404 }
    )
  }

  await db.groupBook.create({
    data: {
      addedById: member.id,
      title: suggestion.title,
      pages: suggestion.pages,
      author: suggestion.author,
      coverUrl: suggestion.coverUrl,
      description: suggestion.description,
      groupId: group.id,
    },
  })
  await db.groupBookSuggestion.delete({
    where: {
      id: suggestionId,
    },
  })
  return NextResponse.json({ message: "Книга добавлена" }, { status: 200 })
}
