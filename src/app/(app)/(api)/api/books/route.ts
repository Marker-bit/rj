import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/server-validate-request";
import { fetchBooks } from "@/lib/books";

export async function GET(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const books = await fetchBooks(user.id);
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const book = await db.book.create({
    data: {
      ...data,
      userId: user.id,
    },
  });
  return NextResponse.json(book);
}
