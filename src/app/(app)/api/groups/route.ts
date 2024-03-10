import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const data = await req.json();
  const group = await db.group.create({
    data: {
      ...data,
      userId: user.id,
    },
  });
  return group;
}
