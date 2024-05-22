import { validateRequest } from "@/lib/server-validate-request";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const bookId = params.bookId;
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }
  const data = await req.json();
  const updateBook = await db.book.update({
    where: {
      id: bookId,
      userId: user.id,
    },
    data: {
      ...data,
      userId: user.id,
    },
  });
  return NextResponse.json(updateBook, {
    status: 200,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const bookId = params.bookId;
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }
  await db.book.delete({
    where: {
      id: bookId,
      userId: user.id,
    },
  });
  return NextResponse.json(
    {
      data: null
    },
    {
      status: 200,
    }
  );
}
