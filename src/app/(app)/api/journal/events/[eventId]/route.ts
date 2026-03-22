import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ eventId: string }> },
) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await props.params;
  const event = await db.readEvent.findUnique({
    where: { id: params.eventId },
    select: { book: { select: { userId: true } } },
  });

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (event.book.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.readEvent.delete({
    where: {
      id: params.eventId,
    },
  });
  return NextResponse.json({ ok: true });
}
