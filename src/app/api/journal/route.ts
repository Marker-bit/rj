import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../auth/session/route";
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
    }
  });

  return NextResponse.json(events);
}
