import { GroupMemberRole } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function POST(
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

  const group = await db.group.findUnique({
    where: {
      id: params.groupId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      members: true,
    },
  });

  if (!group) {
    return NextResponse.json(
      { error: "Не существует группы или вы не состоите в ней" },
      { status: 404 },
    );
  }

  if (
    group.members.find((member) => member.userId === user.id)?.role ===
    GroupMemberRole.CREATOR
  ) {
    return NextResponse.json(
      { error: "Вы не можете покинуть группу создателем" },
      { status: 400 },
    );
  }

  await db.groupMember.deleteMany({
    where: {
      userId: user.id,
      groupId: params.groupId,
    },
  });

  return NextResponse.json({ message: "Вы покинули группу" });
}
