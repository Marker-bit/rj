"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Loader, UserPlus, UserX } from "lucide-react";
import Image from "next/image";

export function FriendView({
  friend,
  following,
}: {
  friend: {
    firstName: string;
    lastName: string;
    username: string;
    id: string;
  };
  following: boolean;
}) {
  const queryClient = useQueryClient();
  const followMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/profile/${friend.username}/follow`, {
        method: following ? "DELETE" : "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", friend.username],
      });
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
      queryClient.invalidateQueries({
        queryKey: ["followers"],
      });
    },
  });
  return (
    <div className="p-4 rounded-md border border-zinc-200 flex gap-2 items-center cursor-pointer group transition-colors">
      <Image
        src="/no-avatar.png"
        alt="avatar"
        width={100}
        height={100}
        className="rounded-full w-16 h-16"
      />
      <div className="flex flex-col">
        <div className="text-xl font-semibold">
          {friend.firstName} {friend.lastName}
        </div>
        <div className="text-sm text-black/70">@{friend.username}</div>
        {following ? (
          <button
            className="flex gap-2 items-center w-fit bg-gray-100 rounded-xl py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200 mx-auto"
            onClick={() => followMutation.mutate()}
            disabled={followMutation.isPending}
          >
            {followMutation.isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <UserX className="w-4 h-4" />
            )}
            Удалить из друзей
          </button>
        ) : (
          <button
            className="flex gap-2 items-center w-fit bg-blue-500 rounded-xl text-white py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40"
            onClick={() => followMutation.mutate()}
            disabled={followMutation.isPending}
          >
            {followMutation.isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Добавить в друзья
          </button>
        )}
      </div>
      <button className="ml-auto">
        <ChevronRight className="w-7 h-7 text-black/50 group-hover:text-black transition-colors" />
      </button>
    </div>
  );
}
