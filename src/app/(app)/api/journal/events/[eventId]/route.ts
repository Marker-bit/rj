import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ eventId: string }> },
) {
  const params = await props.params;
  await db.readEvent.delete({
    where: {
      id: params.eventId,
    },
  });
  return NextResponse.json({ ok: true });
}
