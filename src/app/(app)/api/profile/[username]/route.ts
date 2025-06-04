import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { SharePeople } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ username: string }> },
) {
  const params = await props.params;
  const { user: currentUser } = await validateRequest();
  const user = await db.user.findFirstOrThrow({
    where: {
      username: params.username,
    },
    include: {
      follower: {
        select: {
          second: true,
        },
      },
      following: {
        select: {
          first: true,
        },
      },
    },
  });

  if (!currentUser) {
    return NextResponse.json({
      ...user,
    });
  }
  const follow = await db.follow.findFirst({
    where: {
      firstId: currentUser.id,
      secondId: user.id,
    },
  });

  return NextResponse.json({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id,
    subscriptions:
      user.shareSubscriptions === SharePeople.ALL ||
      (user.shareSubscriptions === SharePeople.SUBS && follow)
        ? user.follower
        : null,
    subscribers:
      user.shareFollowers === SharePeople.ALL ||
      (user.shareFollowers === SharePeople.SUBS && follow)
        ? user.following
        : null,
    following: follow ? true : false,
    avatarUrl: user.avatarUrl,
  });
}
