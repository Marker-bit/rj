import { type NextRequest, NextResponse } from "next/server";
import { fetchBooks } from "@/lib/books";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function GET(_req: NextRequest) {
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
      title: data.title,
      author: data.author,
      pages: data.pages,
      coverUrl: data.coverUrl,
      description: data.description,
      userId: user.id,
    },
  });
  return NextResponse.json(book);
}
