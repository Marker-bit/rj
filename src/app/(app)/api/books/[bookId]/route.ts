import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lockOwnedBook } from "@/lib/book-progress-write";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { bookSchema, submittedPageNumber } from "@/lib/validation/schemas";

const editBookSchema = bookSchema.extend({
  pages: submittedPageNumber,
  clamp: z.boolean().optional(),
});

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
  const parsed = editBookSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error }, { status: 400 });
  }
  const { clamp, ...data } = parsed.data;

  const updateBook = await db.$transaction(async (tx) => {
    const original = await lockOwnedBook(tx, { bookId, userId: user.id });
    if (!original) return null;

    const book = await tx.book.update({
      where: { id: bookId, userId: user.id },
      data,
    });

    // Legacy totals at or below zero have no meaningful scale.
    if (clamp && original.pages > 0 && original.pages !== data.pages) {
      await tx.$executeRaw`
        UPDATE "ReadEvent"
        SET "pagesRead" = GREATEST(1, ROUND(
          LEAST("pagesRead", ${original.pages})::numeric * ${data.pages} / ${original.pages}
        ))::integer
        WHERE "bookId" = ${bookId} AND "pagesRead" > 0
      `;
    }
    return book;
  });

  if (!updateBook) {
    return new NextResponse("Not Found", { status: 404 });
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
