import Image from "next/image";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import FollowButton from "./follow-button";
import { UserTabs } from "./user-tabs";
import { redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
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

export default async function Page(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  const username = params.username;
  const { user: currentUser } = await validateRequest();
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
  });
  if (currentUser?.id === user.id) return redirect("/profile");
  return (
    <div className="m-3 mb-[15vh]">
      <div className="flex items-center gap-2 rounded-md border p-4">
        <Avatar className="size-20">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>
            {user?.firstName && user?.firstName[0]}
            {user?.lastName && user?.lastName[0]}
          </AvatarFallback>
        </Avatar>
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
      <UserTabs
        user={user}
        currentUser={currentUser}
        events={events}
        books={books}
      />
    </div>
  );
}
