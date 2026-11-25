import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { SharePeople } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { publicUserSelect } from "@/lib/user-select";
import { ProfileSections, type ProfileSearchParams } from "../profile-sections";
import FollowButton from "./follow-button";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: ProfileSearchParams;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const username = params.username;

  return {
    title: `@${username} на RJ`,
    openGraph: {
      title: `@${username} на RJ`,
      description: `Профиль пользователя @${username} на RJ`,
      images: `/profile/${username}/og`,
    },
    twitter: {
      card: "summary_large_image",
      title: `@${username} на RJ`,
      description: `Профиль пользователя @${username} на RJ`,
      images: `/profile/${username}/og`,
    },
    creator: "Marker-bit",
    applicationName: "Читательский дневник",
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { username } = await params;
  const { user: currentUser } = await validateRequest();
  const user = await db.user.findFirst({
    where: {
      username: {
        equals: username,
      },
    },
    select: {
      ...publicUserSelect,
      shareSubscriptions: true,
      shareFollowers: true,
      shareStats: true,
      _count: { select: { follower: true, following: true } },
    },
  });
  if (!user) notFound();
  const { _count: counts } = user;
  if (currentUser?.id === user.id) redirect("/profile");

  const [subscriptionToViewer, viewerSubscription] = currentUser
    ? await Promise.all([
        db.follow.findFirst({
          where: { firstId: user.id, secondId: currentUser.id },
          select: { id: true },
        }),
        db.follow.findFirst({
          where: { firstId: currentUser.id, secondId: user.id },
          select: { id: true },
        }),
      ])
    : [null, null];
  const canSee = (setting: SharePeople) =>
    setting === SharePeople.ALL ||
    (setting === SharePeople.SUBS && subscriptionToViewer !== null);

  const canSeeStats = canSee(user.shareStats);
  const canSeeSubscriptions = canSee(user.shareSubscriptions);
  const canSeeFollowers = canSee(user.shareFollowers);
  return (
    <div className="mx-auto mb-[15vh] grid max-w-6xl gap-6 px-3 pt-4 sm:px-6 lg:grid-cols-[minmax(240px,320px)_1fr] lg:items-start lg:pt-10">
      <Card className="flex-row items-center gap-4 px-5 sm:px-6 lg:flex-col lg:items-start">
        <Avatar className="size-20 lg:size-28">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="text-3xl font-semibold">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-muted-foreground">@{username}</div>
          <FollowButton
            following={viewerSubscription !== null}
            username={user.username}
          />
        </div>
      </Card>
      <ProfileSections
        userId={user.id}
        basePath={`/profile/${encodeURIComponent(user.username)}`}
        searchParams={searchParams}
        canSeeStats={canSeeStats}
        subscriptionCount={canSeeSubscriptions ? counts.follower : undefined}
        followerCount={canSeeFollowers ? counts.following : undefined}
      />
    </div>
  );
}
