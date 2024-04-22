"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FollowButton({
  username,
  following,
}: {
  username: string;
  following: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/profile/${username}`)
      .then((res) => res.json())
      .then((res) => router.refresh());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/profile/${username}/follow`, {
        method: following ? "DELETE" : "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
    },
  });

  return following === undefined ? (
    <Skeleton className="w-48 h-10 rounded-md" />
  ) : following ? (
    <Button
      className="gap-2 w-fit"
      onClick={() => followMutation.mutate()}
      disabled={followMutation.isPending}
      variant="outline"
    >
      {followMutation.isPending ? (
        <Loader className="w-4 h-4" />
      ) : (
        <UserX className="w-4 h-4" />
      )}
      Удалить из друзей
    </Button>
  ) : (
    <Button
      className="gap-2 w-fit"
      onClick={() => followMutation.mutate()}
      disabled={followMutation.isPending}
    >
      {followMutation.isPending ? (
        <Loader className="w-4 h-4" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      Добавить в друзья
    </Button>
  );
}
