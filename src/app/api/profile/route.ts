import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../auth/session/route";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
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
  // return NextResponse.json({ name: "John Doe" });
}
