import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { bookSchema } from "@/lib/validation/schemas";

export async function GET(
  _req: NextRequest,
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
  const book = await db.book.findUnique({
    where: {
      id: bookId,
      userId: user.id,
    },
    include: {
      readEvents: true,
    },
  });
  if (!book) {
    return new NextResponse(null, {
      status: 404,
    });
  }
  return NextResponse.json(book, {
    status: 200,
  });
}

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
  const { clamp, ...data } = await req.json();

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

  const originalBook = await db.book.findUniqueOrThrow({
    where: {
      id: bookId,
      userId: user.id,
    },
  });

  const updateBook = await db.book.update({
    where: {
      id: bookId,
      userId: user.id,
    },
    data: {
      ...d.data,
      userId: user.id,
    },
  });

  if (clamp && originalBook.pages !== updateBook.pages) {
    const bookEvents = await db.readEvent.findMany({
      where: {
        bookId: updateBook.id,
      },
    });

    console.log(bookEvents);

    if (bookEvents.length > 0) {
      await db.$transaction(
        bookEvents.map((event) => {
          return db.readEvent.update({
            where: { id: event.id },
            data: {
              pagesRead: Math.round(
                (event.pagesRead / originalBook.pages) * d.data.pages,
              ),
            },
          });
        }),
      );
    }
  }
  return NextResponse.json(updateBook, {
    status: 200,
  });
}

export async function DELETE(
  _req: NextRequest,
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
