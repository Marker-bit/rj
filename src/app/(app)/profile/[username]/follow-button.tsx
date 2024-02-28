"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, UserPlus, UserX } from "lucide-react";
import { useEffect, useState } from "react";

export default function FollowButton({ username }: { username: string }) {
  const [following, setFollowing] = useState<boolean>();

  useEffect(() => {
    fetch(`/api/profile/${username}`)
      .then((res) => res.json())
      .then((res) => setFollowing(res.following));
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
    <Skeleton className="w-12 h-8" />
  ) : following ? (
    <Button
      className="gap-2 w-fit"
      onClick={() => followMutation.mutate()}
      disabled={followMutation.isPending}
      variant="outline"
    >
      {followMutation.isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
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
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      Добавить в друзья
    </Button>
  );
}
