import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function GET(_req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  const userData = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });
  return NextResponse.json(userData);
}
