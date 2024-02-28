import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/server-validate-request";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const events = await db.readEvent.findMany({
    where: {
      book: {
        userId: user.id
      }
    },
    include: {
      book: true
    },
    orderBy: {
      readAt: "desc"
    }
  });

  return NextResponse.json(events);
}
