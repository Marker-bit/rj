import Image from "next/image"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import FollowButton from "./follow-button"
import { UserTabs } from "./user-tabs"
import { redirect } from "next/navigation"
import { Metadata, ResolvingMetadata } from "next"

type Props = {
  params: { username: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username;
  const before = await parent;

  // optionally access and extend (rather than replace) parent metadata
  const _previousImages = before.openGraph?.images || [];

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

export default async function Page({
  params,
}: {
  params: { username: string }
}) {
  const username = params.username
  const { user: currentUser } = await validateRequest()
  const user = await db.user.findFirstOrThrow({
    where: {
      username: {
        equals: username,
      },
    },
    include: {
      following: {
        include: {
          first: true,
          second: true,
        },
      },
      follower: {
        include: {
          first: true,
          second: true,
        },
      },
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
  if (currentUser?.id === user.id) return redirect("/profile")
  return (
    <div className="m-3">
      <div className="flex items-center gap-2 rounded-md border p-4">
        <Image
          src={user?.avatarUrl ? user?.avatarUrl : "/no-avatar.png"}
          alt="avatar"
          width={100}
          height={100}
          className="size-20 rounded-full"
        />
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-muted-foreground/70">@{username}</div>
          <FollowButton
            following={
              !!user.following.find((f) => f.firstId === currentUser?.id)
            }
            username={user.username}
          />
        </div>
      </div>
      <UserTabs user={user} currentUser={currentUser} events={events} books={books} />
    </div>
  )
}
