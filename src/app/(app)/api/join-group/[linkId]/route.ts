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

  const link = await db.groupInviteLink.findUniqueOrThrow({
    where: {
      id: params.linkId,
    },
  });

  const group = await db.group.update({
    where: {
      id: link.groupId,
      members: {
        none: {
          userId: user.id,
        },
      },
    },
    data: {
      members: {
        create: {
          userId: user.id,
          role: GroupMemberRole.MEMBER,
        },
      },
    },
  });

  return NextResponse.json({ groupId: group.id });
}
