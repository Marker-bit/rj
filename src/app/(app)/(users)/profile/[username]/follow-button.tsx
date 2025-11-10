"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    mutationFn: async () => {
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
      router.refresh();
    },
  });

  return following === undefined ? (
    <Skeleton className="h-10 w-48 rounded-md" />
  ) : following ? (
    <Button
      className="w-fit gap-2"
      onClick={() => followMutation.mutate()}
      disabled={followMutation.isPending}
      variant="outline"
    >
      {followMutation.isPending ? (
        <Loader className="size-4" />
      ) : (
        <UserX className="size-4" />
      )}
      Удалить из друзей
    </Button>
  ) : (
    <Button
      className="w-fit gap-2"
      onClick={() => followMutation.mutate()}
      disabled={followMutation.isPending}
    >
      {followMutation.isPending ? (
        <Loader invert className="size-4" />
      ) : (
        <UserPlus className="size-4" />
      )}
      Добавить в друзья
    </Button>
  );
}
