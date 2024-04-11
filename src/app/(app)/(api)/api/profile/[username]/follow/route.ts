import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const { user: currentUser } = await validateRequest();

  if (!currentUser) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }

  const user = await db.user.findFirstOrThrow({
    where: {
      username: params.username,
    },
  });

  const follow = await db.follow.create({
    data: {
      firstId: currentUser.id,
      secondId: user.id,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const { user: currentUser } = await validateRequest();

  if (!currentUser) {
    return new NextResponse("Not Authorized", {
      status: 401,
    });
  }

  const user = await db.user.findFirstOrThrow({
    where: {
      username: params.username,
    },
  });

  await db.follow.deleteMany({
    where: {
      firstId: currentUser.id,
      secondId: user.id,
    },
  });

  return NextResponse.json({ ok: true });
}
