import { GroupMemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

async function generateInviteLinkId(): Promise<string> {
  const id = Math.random()
    .toString(36)
    .substring(2, 6 + 2);
  const existingLink = await db.groupInviteLink.findUnique({ where: { id } });

  return existingLink ? generateInviteLinkId() : id;
}

export async function POST(
  _request: Request,
  props: { params: Promise<{ groupId: string }> },
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
    include: {
      members: true,
    },
  });
  const id = await generateInviteLinkId();
  const member = group.members.find((m) => m.userId === user.id);
  if (!member)
    return NextResponse.json({ error: "Не в группе" }, { status: 401 });
  await db.groupInviteLink.create({
    data: {
      id,
      groupId: group.id,
      createdById: member.id,
    },
  });
  return NextResponse.json({ id });
}
