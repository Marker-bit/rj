import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import StreakBlock from "./streak-block";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";

export async function StreakInfo() {
  const { user } = await validateRequest()
  if (!user) return null

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
  })

  const profile = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
  })

  if (events.length === 0) return null

  return (
    <div className="m-2 grid grid-cols-1 gap-2 md:grid-cols-2">
      {/* <StreakNotification events={events} user={user} />
      <StreakCounter events={events} user={user} /> */}
      <StreakBlock events={events} user={user} />
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
          <div className="text-sm text-muted-foreground/70">
            @{profile.username}
          </div>
        </div>
      </div>
    </div>
  )
}
