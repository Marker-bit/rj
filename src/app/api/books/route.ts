import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../auth/session/route";

export async function GET(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const books = await db.book.findMany({
    where: {
      userId: user.id
    },
    include: {
      collections: true,
      readEvents: true,
      user: false
    },
  });
  const compareBooks = (a: any, b: any) => {
    const aPages = a.readEvents[a.readEvents.length - 1]?.pagesRead;
    const bPages = b.readEvents[b.readEvents.length - 1]?.pagesRead;
    if (!aPages && !bPages) return 0;
    if (!aPages) return 1;
    if (!bPages) return -1;
    if (aPages > bPages) return -1;
    if (aPages == bPages) return 0;
    if (aPages < bPages) return 1;
    return 0;
  }
  const sortedBooks = books.toSorted(compareBooks);
  return NextResponse.json(sortedBooks);
}

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const book = await db.book.create({
    data: {
      ...data,
      userId: user.id
    }
  });
  return NextResponse.json(book);
}