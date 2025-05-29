import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  await db.readEvent.delete({
    where: {
      id: params.eventId,
    },
  });
  return NextResponse.json({ ok: true });
}
