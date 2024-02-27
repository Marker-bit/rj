import { UserX } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FriendView } from "@/components/friend-view";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import FollowButton from "./follow-button";
import { SharePeople } from "@prisma/client";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const [currentTab, setCurrentTab] = useState(0);
  const username = params.username;
  const { user: currentUser } = await validateRequest();
  const user = await db.user.findFirstOrThrow({
    where: {
      username: {
        equals: username,
        not: currentUser?.username ?? "",
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
  const shareSubscriptions =
    user.shareSubscriptions === SharePeople.ALL ||
    (user.shareSubscriptions === SharePeople.SUBS &&
      user.following.find((f) => f.secondId === currentUser?.id));
  const shareFollowers =
    user.shareFollowers === SharePeople.ALL ||
    (user.shareFollowers === SharePeople.SUBS &&
      user.shareFollowers === SharePeople.SUBS &&
      user.following.find((f) => f.secondId === currentUser?.id));
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
          {/* <button className="flex gap-2 items-center w-fit bg-blue-500 rounded-xl text-white py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40">
          <UserPlus className="w-4 h-4 mr-2" />
          Добавить в друзья
        </button> */}
        </div>
      </div>
      <div className="flex p-1 w-full gap-2">
        {shareSubscriptions && (
          <div
            className="hover:bg-zinc-100 rounded-md p-2 w-full flex justify-center cursor-pointer pb-4 relative"
            onClick={() => setCurrentTab(0)}
          >
            Подписки
            <AnimatePresence>
              {currentTab === 0 && (
                <motion.div
                  className="w-5 h-1 rounded-3xl bg-zinc-500 absolute bottom-[0.5rem]"
                  layoutId="current"
                />
              )}
            </AnimatePresence>
          </div>
        )}
        {shareFollowers && (
          <div
            className="hover:bg-zinc-100 rounded-md p-2 w-full flex justify-center cursor-pointer pb-4 relative"
            onClick={() => setCurrentTab(1)}
          >
            Подписчики
            <AnimatePresence>
              {currentTab === 1 && (
                <motion.div
                  className="w-5 h-1 rounded-3xl bg-zinc-500 absolute bottom-[0.5rem]"
                  layoutId="current"
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      {shareSubscriptions && currentTab === 0 ? (
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">Подписки</div>
          {user.following?.map(({ second: friend }: { second: any }) => (
            <FriendView key={friend.id} friend={friend} />
          ))}
        </div>
      ) : shareFollowers && currentTab === 1 ? (
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">Подписчики</div>
          {user.follower?.map(({ first: friend }: { first: any }) => (
            <FriendView key={friend.id} friend={friend} />
          ))}
        </div>
      ) : (
        <div className="p-2 rounded-xl border border-zinc-100 flex items-center gap-2">
          <UserX className="size-8" />
          <div className="flex flex-col">
            <div>Пользователь скрыл подписки и подписчиков</div>
          </div>
        </div>
      )}
    </div>
  );
}
