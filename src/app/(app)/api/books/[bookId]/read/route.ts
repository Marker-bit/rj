import { endOfDay, subDays } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
export async function POST(
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
  const book = await db.book.findFirst({
    where: { id: bookId, userId: user.id },
    select: { id: true, pages: true },
  });
  if (!book) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const data = await req.json();
  const parsedData = z
    .object({
      pages: z.coerce.number().int().min(1).max(book.pages),
      readAt: z.coerce.date().optional(),
    })
    .safeParse(data);

  if (!parsedData.success) {
    return NextResponse.json({ errors: parsedData.error }, { status: 400 });
  }

  const defaultReadAt = endOfDay(subDays(new Date(), 1));
  const event = await db.readEvent.create({
    data: {
      readAt: parsedData.data.readAt || defaultReadAt,
      pagesRead: parsedData.data.pages,
      bookId: bookId as string,
    },
  });
  return NextResponse.json(event, {
    status: 201,
  });
}
