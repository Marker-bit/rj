"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader, UserX, Users2 } from "lucide-react";
import Link from "next/link";
import { FriendView } from "@/components/friend-view";

export default function FriendsPage() {
  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: () => fetch("/api/profile/following").then((res) => res.json()),
  });
  if (friendsQuery.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
        <Link href="/">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
          Подписки
        </div>
        <Link href="/followers" className="ml-auto">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <div className="font-semibold">Подписчики</div>
            <Users2 className="w-6 h-6" />
          </button>
        </Link>
      </div>
      <div className="p-3">
        <div className="flex flex-col gap-2">
          {friendsQuery.data.length === 0 && (
            <div className="p-2 flex gap-2 items-center rounded-xl border border-zinc-200 text-xl">
              <UserX className="w-10 h-10" />
              <div className="flex flex-col">
                <div>У вас нет подписок</div>
                <div className="text-xs text-black/50">Подписывайтесь!</div>
              </div>
            </div>
          )}

          {friendsQuery.data.map(
            ({
              second: friend,
            }: {
              second: {
                firstName: string;
                lastName: string;
                username: string;
                id: string;
                avatarUrl: string;
              };
            }) => (
              <FriendView key={friend.id} friend={friend} following={true} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
