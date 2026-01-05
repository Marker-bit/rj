import { GroupMemberRole } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ groupId: string; bookId: string }> },
) {
  const params = await props.params;
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const data = await req.json();

  await db.groupBook.update({
    where: {
      groupId: params.groupId,
      id: params.bookId,
      group: {
        members: {
          some: {
            userId: user.id,
            role: {
              in: [GroupMemberRole.CREATOR, GroupMemberRole.MODERATOR],
            },
          },
        },
      },
    },
    data: {
      ...data,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ groupId: string; bookId: string }> },
) {
  const params = await props.params;
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  await db.groupBook.delete({
    where: {
      groupId: params.groupId,
      id: params.bookId,
      group: {
        members: {
          some: {
            userId: user.id,
            role: {
              in: [GroupMemberRole.CREATOR, GroupMemberRole.MODERATOR],
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
