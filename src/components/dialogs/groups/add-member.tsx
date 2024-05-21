"use client"

import { Group } from "@prisma/client"
import { DrawerDialog } from "../../ui/drawer-dialog"
import { DialogHeader, DialogTitle } from "../../ui/dialog"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddMember({
  open,
  setOpen,
  group,
}: {
  open: boolean
  setOpen: (b: boolean) => void
  group: Group & {
    members: any[]
  }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string>()
  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: () => fetch("/api/profile/following").then((res) => res.json()),
  })

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
                  className="flex items-center gap-2 rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  onClick={() => {
                    setLoading(friend.id)
                    fetch(`/api/groups/${group.id}/member`, {
                      method: "POST",
                      body: JSON.stringify({ userId: friend.id }),
                    })
                      .then((res) => res.json())
                      .then(() => {
                        setOpen(false)
                        setLoading(undefined)
                        router.refresh()
                      })
                  }}
                >
                  <Image
                    src={friend.avatarUrl || "/no-avatar.png"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="h-8 w-auto rounded-xl"
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
              )
          )}
        </div>
      )}
    </DrawerDialog>
  )
}
