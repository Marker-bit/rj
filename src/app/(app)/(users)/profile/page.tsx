import { ChevronLeft, Edit, Users2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Stats } from "@/components/users/stats"
import { validateRequest } from "@/lib/server-validate-request"
import { db } from "@/lib/db"
import { CopyUrl } from "./CopyUrl"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function ProfilePage() {
  const { user } = await validateRequest()
  if (!user) return null

  const userData = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      follower: true,
      following: true,
    },
  })
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
  const books = await db.book.findMany({
    where: {
      userId: user.id,
    },
    include: {
      readEvents: {
        orderBy: {
          readAt: "desc",
        },
      },
    },
  })

  return (
    <div className="mb-[15vh]">
      <div className="m-2 flex items-center gap-2 text-5xl font-black">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ChevronLeft className="size-6" />
          </Link>
        </Button>
        Профиль
        <div className="ml-auto">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile/settings">
              <Edit className="size-6" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="m-3 flex items-center gap-2 rounded-md border p-4">
        <Avatar className="size-20">
          <AvatarImage src={userData?.avatarUrl} />
          <AvatarFallback>
            {userData?.firstName && userData?.firstName[0]}
            {userData?.lastName && userData?.lastName[0]}
          </AvatarFallback>
        </Avatar>
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
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        }
      >
        <Stats profile={userData} events={events} books={books} />
      </Suspense>
    </div>
  )
}
