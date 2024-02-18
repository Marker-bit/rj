import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {username: string}}) {
  const {user: currentUser} = await validateRequest();
  const user = await db.user.findFirstOrThrow({
    where: {
      username: params.username
    }
  });

  if (!currentUser) {
    return NextResponse.json({
      ...user,
    });
  }
  const follow = await db.follow.findFirst({
    where: {
      first: currentUser,
      second: user
    }
  });

  return NextResponse.json({
    ...user,
    following: follow ? true : false
  });
}