"use client";

import { type User as DbUser, SharePeople } from "@prisma/client";
import type { User } from "lucia";
import { FriendView } from "@/components/users/friend-view";
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
}
