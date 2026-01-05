import { GroupMemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function POST(
  _req: Request,
  props: { params: Promise<{ groupId: string; bookId: string }> },
) {
  const params = await props.params;
  const { user } = await validateRequest();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const book = await db.book.findUniqueOrThrow({
    where: {
      id: params.bookId,
      userId: user.id,
    },
  });

  const groupMember = await db.groupMember.findFirstOrThrow({
    where: {
      userId: user.id,
      groupId: params.groupId,
      role: {
        in: [GroupMemberRole.CREATOR, GroupMemberRole.MODERATOR],
      },
    },
  });

  const groupBook = await db.groupBook.create({
    data: {
      title: book.title,
      pages: book.pages,
      author: book.author,
      coverUrl: book.coverUrl,
      description: book.description,
      groupId: params.groupId,
      addedById: groupMember.id,
    },
  });

  await db.book.update({
    where: {
      id: params.bookId,
      userId: user.id,
    },
    data: {
      groupBookId: groupBook.id,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
