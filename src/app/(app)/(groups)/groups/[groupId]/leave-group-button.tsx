"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

export function LeaveGroupButton({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const leaveGroup = () => {
    setLoading(true);

    fetch(`/api/groups/${groupId}/leave`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.error) {
          toast.error("Возникла проблема при выходе", {
            description: res.error,
          });
        } else {
          toast.success(res.message);
          router.push("/");
        }
      });
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={loading}
      onClick={leaveGroup}
    >
      {loading ? <Loader className="size-4" /> : <LogOut className="size-4" />}
      <p className="max-sm:hidden">Выйти</p>
    </Button>
  );
}
