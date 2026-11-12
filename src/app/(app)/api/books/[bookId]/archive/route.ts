import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { BookStatus } from "@/generated/prisma/enums";

export async function POST(
  _req: NextRequest,
  props: { params: Promise<{ bookId: string }> },
) {
  const params = await props.params;
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }

  const book = await db.book.findUnique({
    where: {
      id: params.bookId,
      userId: user.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!book) {
    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  await db.book.update({
    where: {
      id: book.id,
    },
    data: {
      status:
        book.status === BookStatus.ARCHIVED
          ? BookStatus.NONE
          : BookStatus.ARCHIVED,
    },
  });

  return NextResponse.json({ archived: book.status !== BookStatus.ARCHIVED });
}
