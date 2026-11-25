import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
export async function POST(
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
    where: { id: bookId, userId: user.id },
    select: { id: true },
  });
  if (!book) return new NextResponse("Not Found", { status: 404 });

  const link = await db.bookLink.create({
    data: {
      bookId,
    },
  });
  return NextResponse.json(link);
}
