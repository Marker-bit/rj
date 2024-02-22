import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { eventId: string } }) {
  await db.readEvent.delete({
    where: {
      id: params.eventId,
    },
  });
  return NextResponse.json({ ok: true });
}
