"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, UserPlus, UserX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const followingRes = userQuery.data?.following ?? following;

  const follow = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/${friend.username}/follow`, {
        method: followingRes ? "DELETE" : "POST",
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

  const name = [friend.firstName, friend.lastName].filter(Boolean).join(" ");
  const initials = `${friend.firstName?.trim()[0] ?? ""}${friend.lastName?.trim()[0] ?? ""}`;

  return (
    <div className="flex items-center gap-3 rounded-md border px-3 py-2">
      <Link
        href={`/profile/${friend.username}`}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <Avatar className="size-9" aria-hidden="true">
          <AvatarImage
            src={friend.avatarUrl || undefined}
            alt=""
            className="object-cover"
          />
          <AvatarFallback className="text-xs font-medium uppercase">
            {initials || friend.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 text-sm">
          {name && (
            <div className="flex items-center gap-1 font-semibold">
              <span className="truncate">{name}</span>
              {friend.verified && (
                <BadgeCheck
                  className="size-4 shrink-0 text-yellow-500"
                  aria-label="Подтверждённый профиль"
                />
              )}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs text-muted-foreground">
              @{friend.username}
            </span>
            {currentUserId === friend.id && (
              <Badge className="shrink-0">Вы</Badge>
            )}
          </div>
        </div>
      </Link>
      {currentUserId !== friend.id &&
        (followingRes === undefined && userQuery.isPending ? (
          <Skeleton className="h-8 w-28 shrink-0 rounded-full" />
        ) : (
          <Button
            size="sm"
            className="shrink-0 gap-1.5"
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
