import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function POST(
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

  const groupBook = await db.groupBook.findFirstOrThrow({
    where: {
      groupId: params.groupId,
      id: params.bookId,
    },
  });

  await db.book.deleteMany({
    where: {
      groupBookId: groupBook.id,
      userId: user.id,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
