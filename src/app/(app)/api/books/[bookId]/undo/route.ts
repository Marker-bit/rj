import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
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
  const book = await db.book.findUnique({
    where: {
      id: bookId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });
  if (!book)
    return new NextResponse("Not Found", {
      status: 404,
    });

  const eventId = req.nextUrl.searchParams.get("eventId");

  if (eventId) {
    const deleted = await db.readEvent.deleteMany({
      where: { id: eventId, bookId },
    });
    if (deleted.count === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }
    return NextResponse.json({ ok: true, eventId });
  }

  const latest = await db.readEvent.findFirst({
    where: { bookId },
    orderBy: [{ readAt: "desc" }, { id: "desc" }],
    select: { id: true },
  });
  if (!latest) return new NextResponse(null, { status: 400 });
  await db.readEvent.delete({ where: { id: latest.id } });
  return NextResponse.json({ ok: true, eventId: latest.id });
}
