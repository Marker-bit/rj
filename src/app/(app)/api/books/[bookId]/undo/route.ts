import { type NextRequest, NextResponse } from "next/server";
import { lockOwnedBook } from "@/lib/book-progress-write";
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
  const requestedEventId = req.nextUrl.searchParams.get("eventId");
  const result = await db.$transaction(async (tx) => {
    if (!(await lockOwnedBook(tx, { bookId, userId: user.id }))) {
      return { kind: "not-found" } as const;
    }

    const eventId =
      requestedEventId ||
      (
        await tx.readEvent.findFirst({
          where: { bookId },
          orderBy: [{ readAt: "desc" }, { id: "desc" }],
          select: { id: true },
        })
      )?.id;
    if (!eventId) return { kind: "empty" } as const;

    const deleted = await tx.readEvent.deleteMany({
      where: { id: eventId, bookId },
    });
    return deleted.count > 0
      ? ({ kind: "deleted", eventId } as const)
      : ({ kind: "not-found" } as const);
  });

  if (result.kind === "not-found") {
    return new NextResponse("Not Found", { status: 404 });
  }
  if (result.kind === "empty") return new NextResponse(null, { status: 400 });
  return NextResponse.json({ ok: true, eventId: result.eventId });
}
