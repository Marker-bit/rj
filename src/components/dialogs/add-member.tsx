"use client";

import { Group } from "@prisma/client";
import { DrawerDialog } from "../drawer";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddMember({
  open,
  setOpen,
  group,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  group: Group & {
    members: any[];
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string>();
  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: () => fetch("/api/profile/following").then((res) => res.json()),
  });

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Добавить участника</DialogTitle>
      </DialogHeader>
      {friendsQuery.isPending ? (
        <div>Загрузка...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {friendsQuery.data.map(
            ({ second: friend }: any) =>
              group.members.every((m: any) => m.userId !== friend.id) && (
                <button
                  key={friend.id}
                  className="flex gap-2 items-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
                  onClick={() => {
                    setLoading(friend.id);
                    fetch(`/api/groups/${group.id}/member`, {
                      method: "POST",
                      body: JSON.stringify({ userId: friend.id }),
                    })
                      .then((res) => res.json())
                      .then(() => {
                        setOpen(false);
                        setLoading(undefined);
                        router.refresh();
                      });
                  }}
                >
                  <Image
                    src={friend.avatarUrl || "/no-avatar.png"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-xl h-8 w-auto"
                  />
                  <div className="flex flex-col items-start">
                    <div className="font-bold">
                      {friend.firstName} {friend.lastName}
                    </div>
                    <div className="text-muted-foreground/70 text-sm">
                      @{friend.username}
                    </div>
                  </div>
                  <div className="ml-auto">
                    {loading === friend.id && (
                      <Loader className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                </button>
              )
          )}
        </div>
      )}
    </DrawerDialog>
  );
}
