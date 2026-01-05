"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function JoinGroupButton({
  link,
  user,
}: {
  link: { id: string; group: { blockedUsers: { id: string }[] } };
  user: { id: string };
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <Button
      className="items-center gap-2"
      disabled={
        loading || link.group.blockedUsers.some((u) => u.id === user.id)
      }
      onClick={() =>
        toast.promise(
          async () => {
            setLoading(true);

            const res = await fetch(`/api/join-group/${link.id}`, {
              method: "POST",
            });

            const json = await res.json();
            setLoading(false);
            if (!json.groupId) return;

            router.push(`/groups/${json.groupId}`);
          },
          {
            loading: "Вход в группу...",
            success: "Вы вступили в группу",
            error: "Произошла ошибка при входе в группу",
          },
        )
      }
    >
      <Check className="size-4" />
      Принять
    </Button>
  );
}
