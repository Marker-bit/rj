import { validateRequest } from "@/lib/server-validate-request";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { endOfDay, subDays } from "date-fns";
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
  const data: {
    pages: number;
    readAt?: string;
  } = await req.json();
  const defaultReadAt = endOfDay(subDays(new Date(), 1));
  const event = await db.readEvent.create({
    data: {
      readAt: data.readAt || defaultReadAt,
      pagesRead: data.pages,
      bookId: bookId as string,
    },
  });
  return NextResponse.json(event, {
    status: 201,
  });
}
