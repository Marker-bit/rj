import { validateRequest } from "@/lib/server-validate-request";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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
  const collections = await req.json();
  const updateBook = await db.book.update({
    where: {
      id: bookId,
      userId: user.id,
    },
    data: {
      collections: {
        set: collections.map((id: string) => ({ id })),
      },
    },
  });
  // const updateBook = await db.book.update({
  //   where: {
  //     id: bookId,
  //     userId: user.id,
  //   },
  //   data: {
  //     ...data,
  //     userId: user.id,
  //   },
  // });
  return NextResponse.json(updateBook, {
    status: 200,
  });
}
