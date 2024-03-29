import Image from "next/image";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import FollowButton from "./follow-button";
import { UserTabs } from "./user-tabs";
import { redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { username: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const username = params.username;

//   // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];

//   return {
//     openGraph: {
//       images: [`/profile/${username}/og`, ...previousImages],
//     },
//   };
// }

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
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
  if (currentUser?.id === user.id) return redirect("/profile");
  return (
    <div className="m-3">
      <div className="p-4 rounded-md border border-zinc-200 flex gap-2 items-center">
        <Image
          src={user?.avatarUrl ? user?.avatarUrl : "/no-avatar.png"}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full w-20 h-20"
        />
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-black/70">@{username}</div>
          <FollowButton username={user.username} />
        </div>
      </div>
      <UserTabs user={user} currentUser={currentUser} events={events} />
    </div>
  );
}
