import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { GroupMemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, props: { params: Promise<{ groupId: string }> }) {
  const params = await props.params;
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const data = await req.json();
  const group = await db.group.update({
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
    data: {
      members: {
        create: {
          userId: data.userId,
          role: GroupMemberRole.MEMBER,
        },
      },
    },
  });

  return NextResponse.json(group);
}
