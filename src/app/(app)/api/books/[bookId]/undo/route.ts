import { validateRequest } from "@/lib/server-validate-request";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ bookId: string }> },
) {
  const params = await props.params;
  const bookId = params.bookId;
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }
  const book = await db.book.findUniqueOrThrow({
    where: {
      id: bookId,
      userId: user.id,
    },
    select: {
      readEvents: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!book.readEvents.length)
    return new NextResponse(null, {
      status: 400,
    });
  await db.readEvent.delete({
    where: {
      id: book.readEvents[book.readEvents.length - 1].id,
    },
  });
  return NextResponse.json(book, {
    status: 201,
  });
}
