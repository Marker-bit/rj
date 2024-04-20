import { ChevronLeft, Edit, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Stats } from "@/components/stats";
import { validateRequest } from "@/lib/server-validate-request";
import { db } from "@/lib/db";
import { CopyUrl } from "./CopyUrl";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const { user } = await validateRequest();
  if (!user) return null;

  const userData = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });
  const events = await db.readEvent.findMany({
    where: {
      book: {
        userId: user.id,
      },
    },
    include: {
      book: true,
    },
    orderBy: {
      readAt: "asc",
    },
  });

  return (
    <div className="mb-[15vh]">
      <div className="text-5xl font-black m-2 flex gap-2 items-center">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ChevronLeft className="w-6 h-6" />
          </Link>
        </Button>
        Профиль
        <div className="ml-auto">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/friends">
              <Users2 className="w-6 h-6" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile/settings">
              <Edit className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="m-3 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 flex gap-2 items-center">
        <Image
          src={userData?.avatarUrl ? userData?.avatarUrl : "/no-avatar.png"}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full w-20 h-20"
        />
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">
            {userData?.firstName} {userData?.lastName}
          </div>
          <div className="text-sm text-muted-foreground/70">
            @{userData?.username}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <CopyUrl username={userData?.username!} />
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
          </div>
        }
      >
        <Stats profile={userData} events={events} />
      </Suspense>
    </div>
  );
}
