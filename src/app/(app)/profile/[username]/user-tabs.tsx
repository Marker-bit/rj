"use client";

import { SharePeople } from "@prisma/client";
import { User } from "lucia";
import { User as DbUser } from "@prisma/client";
import { useState } from "react";
import { FriendView } from "@/components/friend-view";
import { UserX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Stats } from "@/components/stats";

export function UserTabs({
  user,
  currentUser,
  events
}: {
  user: DbUser & {
    following: {
      first: DbUser;
      second: DbUser;
      firstId: string;
      secondId: string;
    }[];
    follower: {
      first: DbUser;
      second: DbUser;
      firstId: string;
      secondId: string;
    }[];
  };
  currentUser: User | null;
  events: ({
    book: {
      id: string;
      title: string;
      author: string;
      pages: number;
      description: string;
      coverUrl: string | null;
      userId: string;
      groupBookId: string | null;
    };
  } & {
    id: string;
    readAt: Date;
    pagesRead: number;
    bookId: string;
  })[];
}) {
  const [currentTab, setCurrentTab] = useState(0);

  const shareSubscriptions =
    user.shareSubscriptions === SharePeople.ALL ||
    (user.shareSubscriptions === SharePeople.SUBS &&
      user.following.find((f) => f.secondId === currentUser?.id));
  const shareFollowers =
    user.shareFollowers === SharePeople.ALL ||
    (user.shareFollowers === SharePeople.SUBS &&
      user.shareFollowers === SharePeople.SUBS &&
      user.following.find((f) => f.secondId === currentUser?.id));
  const shareStats =
    user.shareStats === SharePeople.ALL ||
    (user.shareStats === SharePeople.SUBS &&
      user.following.find((f) => f.secondId === currentUser?.id));
  console.log(user);
  return (
    <div className="flex flex-col">
      {shareSubscriptions && (
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">Подписки</div>
          {user.follower?.map(({ second: friend }: { second: any }) => (
            <FriendView key={friend.id} friend={friend} />
          ))}
        </div>
      )}
      {shareFollowers && (
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">Подписчики</div>
          {user.following.map(({ first: friend }: { first: any }) => (
            <FriendView key={friend.id} friend={friend} />
          ))}
        </div>
      )}
      {shareStats && (
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">Статистика</div>
          <Stats profile={user as any} events={events} />
        </div>
      )}
    </div>
  );
  return (
    <>
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
          {user.follower?.map(({ second: friend }: { second: any }) => (
            <FriendView key={friend.id} friend={friend} />
          ))}
        </div>
      ) : shareFollowers && currentTab === 1 ? (
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">Подписчики</div>
          {user.following.map(({ first: friend }: { first: any }) => (
            <FriendView key={friend.id} friend={friend} />
          ))}
        </div>
      ) : (
        shareSubscriptions === false &&
        shareFollowers === false && (
          <div className="p-2 rounded-xl border border-zinc-100 flex items-center gap-2">
            <UserX className="size-8" />
            <div className="flex flex-col">
              <div>Пользователь скрыл подписки и подписчиков</div>
            </div>
          </div>
        )
      )}
    </>
  );
}
