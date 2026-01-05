import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function GET(_req: NextRequest) {
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
          id: true,
          avatarUrl: true,
        },
      },
      first: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true,
          avatarUrl: true,
        },
      },
    },
  });

  return NextResponse.json(follows);
}
