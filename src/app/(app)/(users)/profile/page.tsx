import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { SettingsButton } from "@/components/settings/settings-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { ProfileSections, type ProfileSearchParams } from "./profile-sections";
import { ShareProfileButton } from "./share-profile-button";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: ProfileSearchParams;
}) {
  const user = await requireUser();

  const userData = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      _count: { select: { follower: true, following: true } },
    },
  });
  const { _count: counts } = userData;
  return (
    <div className="mx-auto mb-[15vh] max-w-6xl px-3 sm:px-6 lg:pt-8">
      <div className="m-2 flex items-center gap-2 text-3xl font-bold">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/home" aria-label="На главную">
            <ChevronLeft className="size-6" />
          </Link>
        </Button>
        Профиль
        <div className="ml-auto">
          <SettingsButton />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(240px,320px)_1fr] lg:items-start">
        <Card className="gap-4 px-5 sm:px-6">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start">
            <Avatar className="size-20 lg:size-28">
              <AvatarImage src={userData?.avatarUrl} />
              <AvatarFallback>
                {userData?.firstName?.[0]}
                {userData?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="text-3xl font-semibold">
                {userData?.firstName} {userData?.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                @{userData?.username}
              </div>
            </div>
          </div>
          <ShareProfileButton username={userData.username} />
        </Card>
        <ProfileSections
          userId={userData.id}
          basePath="/profile"
          searchParams={searchParams}
          canSeeStats
          subscriptionCount={counts.follower}
          followerCount={counts.following}
        />
      </div>
    </div>
  );
}
