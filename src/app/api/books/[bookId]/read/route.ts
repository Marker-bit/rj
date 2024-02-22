import { validateRequest } from "@/lib/server-validate-request";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function POST(
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
  const data: {
    pages: number;
    readAt?: string;
  } = await req.json();
  const event = await db.readEvent.create({
    data: {
      readAt: data.readAt || new Date(),
      pagesRead: data.pages,
      bookId: bookId as string,
    },
  });
  return NextResponse.json(event, {
    status: 201,
  });
}
