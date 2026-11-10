"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, UserPlus, UserX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { revalidate } from "@/lib/actions/revalidate";
import type { PublicUser } from "@/lib/user-types";
import { Badge } from "../ui/badge";
import { Loader } from "../ui/loader";

export function FriendView({
  friend,
  following,
}: {
  friend: PublicUser;
  following?: boolean;
}) {
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["user", friend.username],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${friend.username}`);
      return await res.json();
    },
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then((res) => {
      res.json().then((data) => {
        setCurrentUserId(data.id);
      });
    });
  }, []);
  const follow = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/${friend.username}/follow`, {
        method: following || userQuery.data?.following ? "DELETE" : "POST",
      });
      if (!res.ok) {
        toast.error("Не удалось изменить подписку");
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ["user", friend.username],
      });
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
      await revalidate("profile");
    } catch {
      toast.error("Не удалось изменить подписку");
    } finally {
      setLoading(false);
    }
  };

  const followingRes = following || userQuery.data?.following;
  return (
    <div className="group flex cursor-pointer items-center gap-2 rounded-md border p-4 transition-colors">
      <Link
        href={`/profile/${friend.username}`}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <Image
          src={friend.avatarUrl ? friend.avatarUrl : "/no-avatar.png"}
          alt="avatar"
          width={100}
          height={100}
          className="size-16 rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xl font-semibold">
            {friend.firstName} {friend.lastName}
            {friend.verified && (
              <BadgeCheck className="size-6 text-yellow-500" />
            )}
          </div>
          <div className="text-sm text-muted-foreground/70">
            @{friend.username}
          </div>
          {currentUserId === friend.id && <Badge className="w-fit">Вы</Badge>}
        </div>
      </Link>
      {currentUserId !== friend.id &&
        (followingRes === undefined && userQuery.isPending ? (
          <Skeleton className="h-10 w-48 rounded-md" />
        ) : (
          <Button
            className="mt-2 w-fit gap-2"
            onClick={() => void follow()}
            disabled={loading}
            variant={followingRes === true ? "outline" : "default"}
          >
            {followingRes === false ? (
              <>
                {loading ? (
                  <Loader invert={!followingRes} className="size-4" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                Подписаться
              </>
            ) : (
              <>
                {loading ? (
                  <Loader invert={!followingRes} className="size-4" />
                ) : (
                  <UserX className="size-4" />
                )}
                Отписаться
              </>
            )}
          </Button>
        ))}
    </div>
  );
}
