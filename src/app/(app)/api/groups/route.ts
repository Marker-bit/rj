import { GroupMemberRole } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const data = await req.json();
  const group = await db.group.create({
    data: {
      ...data,
    },
  });
  const _member = await db.groupMember.create({
    data: {
      role: GroupMemberRole.CREATOR,
      userId: user.id,
      groupId: group.id,
    },
  });
  return NextResponse.json(group);
}
