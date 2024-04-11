"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader, UserX, Users2 } from "lucide-react";
import Link from "next/link";
import { FriendView } from "@/components/friend-view";
import { Button } from "@/components/ui/button";

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
      <div className="text-5xl font-black m-2 flex gap-2 items-center">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-8 h-8" />
          </Button>
        </Link>
        Подписки
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
