import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { NextResponse } from "next/server";

export async function GET() {
  const { user } = await validateRequest();
  if (!user) {
    return new NextResponse("Not authorized");
  }

  const { aiEnabled } = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
  });

  return NextResponse.json({ aiEnabled });
}
