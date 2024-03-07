import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { ChevronRight, User } from "lucide-react";
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
    <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
      <Link href="/profile">
        <h2 className="text-3xl font-black flex gap-1 items-center cursor-pointer hover:text-black/70 w-fit flex-wrap">
          <User className="w-8 h-8 mr-1" />
          Профиль
          <ChevronRight className="w-8 h-8" />
        </h2>
      </Link>
      <div className="p-2 rounded-md border border-zinc-200 flex gap-2 items-center">
        <Image
          src={profile.avatarUrl ? profile.avatarUrl : "/no-avatar.png"}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full w-20 h-20"
        />
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="text-sm text-black/70">@{profile.username}</div>
        </div>
      </div>
    </div>
  );
}
