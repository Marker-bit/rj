"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Loader, UserPlus, UserX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function FriendView({
  friend,
  following,
}: {
  friend: {
    firstName: string;
    lastName: string;
    username: string;
    id: string;
    avatarUrl: string;
    verified: boolean;
  };
  following?: boolean;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const userQuery = useQuery({
    queryKey: ["user", friend.username],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${friend.username}`);
      return await res.json();
    },
  });
  const followMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/profile/${friend.username}/follow`, {
        method: following || userQuery.data?.following ? "DELETE" : "POST",
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
      router.refresh();
    },
  });
  return (
    <Link href={`/profile/${friend.username}`}>
      <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 flex gap-2 items-center cursor-pointer group transition-colors">
        <Image
          src={friend.avatarUrl ? friend.avatarUrl : "/no-avatar.png"}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full w-16 h-16"
        />
        <div className="flex flex-col">
          <div className="text-xl font-semibold flex items-center gap-2">
            {friend.firstName} {friend.lastName}
            {friend.verified && (
              <BadgeCheck className="w-6 h-6 text-yellow-500" />
            )}
          </div>
          <div className="text-sm text-muted-foreground/70">@{friend.username}</div>
          {following === true ? (
            <Button
              className="gap-2 w-fit"
              onClick={(evt) => {
                followMutation.mutate();
                evt.preventDefault();
              }}
              disabled={followMutation.isPending}
              variant="outline"
            >
              {followMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <UserX className="w-4 h-4" />
              )}
              Отменить подписку
            </Button>
          ) : following === false ? (
            <Button
              className="gap-2 w-fit"
              onClick={(evt) => {
                followMutation.mutate();
                evt.preventDefault();
              }}
              disabled={followMutation.isPending}
            >
              {followMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Подписаться
            </Button>
          ) : userQuery.isPending ? (
            <Skeleton className="w-48 h-10 rounded-md" />
          ) : userQuery.data?.following ? (
            <Button
              className="gap-2 w-fit"
              onClick={(evt) => {
                followMutation.mutate();
                evt.preventDefault();
              }}
              disabled={followMutation.isPending}
              variant="outline"
            >
              {followMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <UserX className="w-4 h-4" />
              )}
              Отменить подписку
            </Button>
          ) : (
            <Button
              className="gap-2 w-fit"
              onClick={(evt) => {
                followMutation.mutate();
                evt.preventDefault();
              }}
              disabled={followMutation.isPending}
            >
              {followMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Подписаться
            </Button>
          )}
        </div>
        {/* <button className="ml-auto">
        <ChevronRight className="w-7 h-7 text-black/50 group-hover:text-black transition-colors" />
      </button> */}
      </div>
    </Link>
  );
}
