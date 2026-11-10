import { SharePeople } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { publicUserSelect } from "@/lib/user-select";

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ username: string }> },
) {
  const params = await props.params;
  const { user: currentUser } = await validateRequest();
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
    select: {
      ...publicUserSelect,
      shareSubscriptions: true,
      shareFollowers: true,
      shareStats: true,
      follower: {
        select: {
          second: { select: publicUserSelect },
        },
      },
      following: {
        select: {
          first: { select: publicUserSelect },
        },
      },
    },
  });

  if (!user) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (!currentUser) {
    return NextResponse.json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      verified: user.verified,
      following: false,
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
    following: !!follow,
    avatarUrl: user.avatarUrl,
  });
}
