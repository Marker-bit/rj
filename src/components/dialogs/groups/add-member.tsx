"use client";

import type { Group } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Loader, UserPlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { DrawerDialog } from "../../ui/drawer-dialog";
import { revalidate } from "@/lib/actions/revalidate";

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
  const [loading, setLoading] = useState<string>();
  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: () => fetch("/api/profile/following").then((res) => res.json()),
  });

  const candidates = (friendsQuery.data ?? []).filter(
    ({ second: friend }: any) =>
      group.members.every((member: any) => member.userId !== friend.id),
  );

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Добавить участника</DialogTitle>
        <DialogDescription>
          Выберите читателя из своих подписок.
        </DialogDescription>
      </DialogHeader>
      {friendsQuery.isPending ? (
        <div className="flex h-24 items-center justify-center">
          <Loader className="size-5 animate-spin" />
        </div>
      ) : friendsQuery.isError ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Не удалось загрузить подписки.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void friendsQuery.refetch()}
          >
            Повторить
          </Button>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed p-6 text-center">
          <UserPlus className="size-6 text-muted-foreground" />
          <div className="text-sm font-medium">Некого добавить</div>
          <p className="text-sm text-muted-foreground">
            {friendsQuery.data?.length === 0
              ? "Сначала подпишитесь на кого-нибудь в профиле."
              : "Все ваши подписки уже в группе."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {candidates.map(({ second: friend }: any) => (
            <button
              type="button"
              key={friend.id}
              className="flex items-center gap-2 rounded-xl p-2 text-left transition-colors hover:bg-muted"
              disabled={loading === friend.id}
              onClick={async () => {
                setLoading(friend.id);
                try {
                  const response = await fetch(
                    `/api/groups/${group.id}/member`,
                    {
                      method: "POST",
                      body: JSON.stringify({ userId: friend.id }),
                    },
                  );
                  if (!response.ok) {
                    throw new Error("add member failed");
                  }
                  toast.success("Участник добавлен");
                  setOpen(false);
                  void revalidate("groups");
                } catch {
                  toast.error("Не удалось добавить участника");
                } finally {
                  setLoading(undefined);
                }
              }}
            >
              <Image
                src={friend.avatarUrl || "/no-avatar.png"}
                alt="avatar"
                width={40}
                height={40}
                className="size-8 rounded-full object-cover"
              />
              <div className="flex flex-col items-start">
                <div className="font-bold">
                  {friend.firstName} {friend.lastName}
                </div>
                <div className="text-sm text-muted-foreground/70">
                  @{friend.username}
                </div>
              </div>
              <div className="ml-auto">
                {loading === friend.id && (
                  <Loader className="size-4 animate-spin" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </DrawerDialog>
  );
}
