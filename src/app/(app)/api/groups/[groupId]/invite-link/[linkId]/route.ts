import { GroupMemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ groupId: string; linkId: string }> },
) {
  const params = await props.params;
  const { user } = await validateRequest();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
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
  });

  if (!group)
    return NextResponse.json(
      { error: "Не существует группы" },
      { status: 404 },
    );

  await db.groupInviteLink.delete({
    where: {
      id: params.linkId,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
