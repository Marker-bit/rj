import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { BadgeCheck, ChevronRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function Profile() {
  const { user } = await validateRequest();
  if (!user) return null;
  const profile = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
  });
  return (
    <div className="flex cursor-default flex-col gap-3 border-b p-3">
      <Link href="/profile">
        <h2 className="flex w-fit cursor-pointer flex-wrap items-center gap-1 text-3xl font-black hover:text-black/70 dark:hover:text-white/70">
          <User className="mr-1 size-8" />
          Профиль
          <ChevronRight className="size-8" />
        </h2>
      </Link>
      <div className="flex items-center gap-2 rounded-md border p-2">
        <Image
          src={profile.avatarUrl ? profile.avatarUrl : "/no-avatar.png"}
          alt="avatar"
          width={100}
          height={100}
          className="size-20 rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-3xl font-semibold">
            {profile.firstName} {profile.lastName}
            {profile.verified && (
              <BadgeCheck className="size-6 text-yellow-500" />
            )}
          </div>
          <div className="text-sm text-muted-foreground/70">@{profile.username}</div>
        </div>
      </div>
    </div>
  );
}
