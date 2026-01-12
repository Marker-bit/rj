import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function GET(_req: NextRequest) {
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const events = await db.readEvent.findMany({
    where: {
      book: {
        userId: user.id,
      },
    },
    include: {
      book: true,
    },
    orderBy: {
      readAt: "desc",
    },
  });

  return NextResponse.json(events);
}
