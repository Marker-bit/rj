"use client";

import { UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { revalidate } from "@/lib/actions/revalidate";

export default function FollowButton({
  username,
  following: initialFollowing,
}: {
  username: string;
  following: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, setPending] = useState(false);

  async function toggleFollow() {
    setPending(true);
    try {
      const response = await fetch(`/api/profile/${username}/follow`, {
        method: following ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("follow request failed");
      }

      setFollowing((value) => !value);
      await revalidate("profile");
    } catch {
      toast.error("Не удалось изменить подписку");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      className="w-fit gap-2"
      onClick={toggleFollow}
      disabled={pending}
      variant={following ? "outline" : "default"}
    >
      {pending ? (
        <Loader invert={!following} className="size-4" />
      ) : following ? (
        <UserMinus className="size-4" />
      ) : (
        <UserPlus className="size-4" />
      )}
      {following ? "Отписаться" : "Подписаться"}
    </Button>
  );
}
