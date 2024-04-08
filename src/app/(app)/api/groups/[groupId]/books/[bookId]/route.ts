import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { GroupMemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { groupId: string; bookId: string } }
) {
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const groupBook = await db.groupBook.findFirstOrThrow({
    where: {
      groupId: params.groupId,
      id: params.bookId,
    },
  });

  const createdBook = await db.book.create({
    data: {
      title: groupBook.title,
      pages: groupBook.pages,
      author: groupBook.author,
      coverUrl: groupBook.coverUrl,
      description: groupBook.description,
      groupBookId: groupBook.id,
      userId: user.id,
    },
  });

  return NextResponse.json(createdBook);
}
