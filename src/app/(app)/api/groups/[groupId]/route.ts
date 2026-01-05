import { GroupMemberRole } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ groupId: string }> },
) {
  const params = await props.params;
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const group = await db.group.findUniqueOrThrow({
    where: {
      id: params.groupId,
      members: {
        some: {
          userId: user.id,
          role: GroupMemberRole.CREATOR,
        },
      },
    },
  });

  if (!group) {
    return NextResponse.json(
      { error: "Не существует группы или вы не создатель" },
      { status: 404 },
    );
  }

  await db.group.delete({
    where: {
      id: params.groupId,
    },
  });

  return NextResponse.json({ message: "Группа удалена" }, { status: 200 });
}
