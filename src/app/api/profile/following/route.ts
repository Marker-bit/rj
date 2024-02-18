import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }

  const follows = await db.follow.findMany({
    where: {
      firstId: user.id,
    },
    include: {
      second: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        },
      },
      first: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        },
      },
    },
  });

  return NextResponse.json(follows);
}
