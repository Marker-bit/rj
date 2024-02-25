"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, UserPlus, UserX } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Page() {
  const { username } = useParams();
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["user", username],
    queryFn: () => {
      return fetch(`/api/profile/${username}`).then((res) => res.json());
    },
  });

  const followMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/profile/${username}/follow`, {
        method: userData.following ? "DELETE" : "POST",
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

  if (userQuery.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (userQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {userQuery.error.message}
      </div>
    );
  }

  const userData = userQuery.data!;
  return (
    <div className="m-3 p-4 rounded-md border border-zinc-200 flex gap-2 items-center">
      <Image
        src={userData?.avatarUrl ? userData?.avatarUrl : "/no-avatar.png"}
        alt="avatar"
        width={100}
        height={100}
        className="rounded-full w-20 h-20"
      />
      <div className="flex flex-col">
        <div className="text-3xl font-semibold">
          {userData?.firstName} {userData?.lastName}
        </div>
        <div className="text-sm text-black/70">@{username}</div>
        {userData.following ? (
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
        )}
        {/* <button className="flex gap-2 items-center w-fit bg-blue-500 rounded-xl text-white py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40">
          <UserPlus className="w-4 h-4 mr-2" />
          Добавить в друзья
        </button> */}
      </div>
    </div>
  );
}
