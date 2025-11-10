import { validateRequest } from "@/lib/server-validate-request";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  fields: z.array(
    z.object({
      title: z.string({ error: "Название поля обязательно" }),
      value: z.string({
        error: "Значение поля обязательно",
      }),
    }),
  ),
});

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
  const data = await req.json();

  const d = bookSchema.safeParse(data);
  if (!d.success) {
    return NextResponse.json(
      {
        errors: d.error,
      },
      {
        status: 400,
      },
    );
  }
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
  await db.book.delete({
    where: {
      id: bookId,
      userId: user.id,
    },
  });
  return NextResponse.json(
    {
      data: null,
    },
    {
      status: 200,
    },
  );
}
