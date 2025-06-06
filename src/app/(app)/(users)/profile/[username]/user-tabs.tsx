"use client";

import { SharePeople } from "@prisma/client";
import { User } from "lucia";
import { User as DbUser } from "@prisma/client";
import { useState } from "react";
import { FriendView } from "@/components/users/friend-view";
import { UserX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Stats } from "@/components/users/stats";

export function UserTabs({
  user,
  currentUser,
  events,
  books,
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
  books: {
    id: string;
    readEvents: {
      pagesRead: number;
    }[];
    pages: number;
  }[];
}) {
  const [currentTab, setCurrentTab] = useState(0);

  const shareSubscriptions =
    user.shareSubscriptions === SharePeople.ALL ||
    (user.shareSubscriptions === SharePeople.SUBS &&
      user.follower.find((f) => f.secondId === currentUser?.id));
  const shareFollowers =
    user.shareFollowers === SharePeople.ALL ||
    (user.shareFollowers === SharePeople.SUBS &&
      user.shareFollowers === SharePeople.SUBS &&
      user.follower.find((f) => f.secondId === currentUser?.id));
  const shareStats =
    user.shareStats === SharePeople.ALL ||
    (user.shareStats === SharePeople.SUBS &&
      user.follower.find((f) => f.secondId === currentUser?.id));

  return (
    <div className="flex flex-col">
      {shareSubscriptions && user.follower?.length !== 0 && (
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">Подписки</div>
          {user.follower?.map(({ second: friend }: { second: any }) => (
            <FriendView key={friend.id} friend={friend} />
          ))}
        </div>
      )}
      {shareFollowers && user.following?.length !== 0 && (
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
          <Stats profile={user as any} events={events} books={books} />
        </div>
      )}
    </div>
  );
  return (
    <>
      <div className="flex w-full gap-2 p-1">
        {shareSubscriptions && (
          <div
            className="relative flex w-full cursor-pointer justify-center rounded-md p-2 pb-4 hover:bg-zinc-100"
            onClick={() => setCurrentTab(0)}
          >
            Подписки
            <AnimatePresence>
              {currentTab === 0 && (
                <motion.div
                  className="absolute bottom-2 h-1 w-5 rounded-3xl bg-zinc-500"
                  layoutId="current"
                />
              )}
            </AnimatePresence>
          </div>
        )}
        {shareFollowers && (
          <div
            className="relative flex w-full cursor-pointer justify-center rounded-md p-2 pb-4 hover:bg-zinc-100"
            onClick={() => setCurrentTab(1)}
          >
            Подписчики
            <AnimatePresence>
              {currentTab === 1 && (
                <motion.div
                  className="absolute bottom-2 h-1 w-5 rounded-3xl bg-zinc-500"
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
          <div className="flex items-center gap-2 rounded-xl border border-zinc-100 p-2">
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
