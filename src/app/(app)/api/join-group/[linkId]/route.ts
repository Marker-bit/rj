import { GroupMemberRole } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function POST(
  _req: NextRequest,
  props: { params: Promise<{ linkId: string }> },
) {
  const params = await props.params;
  const { user } = await validateRequest();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const link = await db.groupInviteLink.findUnique({
    where: {
      id: params.linkId,
    },
  });

  if (!link) return new NextResponse("Not Found", { status: 404 });

  const existing = await db.groupMember.findFirst({
    where: {
      groupId: link.groupId,
      userId: user.id,
    },
  });

  if (existing) return NextResponse.json({ groupId: link.groupId });

  const group = await db.group.findFirst({
    where: {
      id: link.groupId,
      blockedUsers: {
        none: {
          id: user.id,
        },
      },
    },
  });

  if (!group) return new NextResponse("Forbidden", { status: 403 });

  await db.groupMember.create({
    data: {
      userId: user.id,
      groupId: group.id,
      role: GroupMemberRole.MEMBER,
    },
  });

  return NextResponse.json({ groupId: group.id });
}
