"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { Input } from "@/components/ui/input"
import { Group, GroupInviteLink } from "@prisma/client"
import { CopyIcon, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function AddGroupLink({
  open,
  setOpen,
  group,
}: {
  open: boolean
  setOpen: (b: boolean) => void
  group: Group & {
    members: any[]
    inviteLinks: GroupInviteLink[]
  }
}) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string>()
  const [createLoading, setCreateLoading] = useState(false)

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Пригласительные ссылки</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        {group.inviteLinks.map((link) => (
          <div key={link.id} className="flex items-center gap-2 rounded-xl p-2">
            <Input
              value={`${
                typeof window !== "undefined" ? window.location.origin : ""
              }/join-group/${link.id}`}
              readOnly={true}
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }/join-group/${link.id}`
                )
                toast.success("Ссылка скопирована")
              }}
            >
              <CopyIcon className="size-4" />
            </Button>
            <Button
              onClick={() => {
                toast.promise(
                  async () => {
                    if (loadingId === link.id) return
                    setLoadingId(link.id)
                    await fetch(
                      `/api/groups/${group.id}/invite-link/${link.id}`,
                      {
                        method: "DELETE",
                      }
                    )
                    setLoadingId(undefined)
                    router.refresh()
                    setOpen(false)
                  },
                  {
                    loading: "Удаление...",
                    success: "Ссылка удалена",
                    error: "Возникла ошибка при удалении ссылки",
                  }
                )
              }}
              variant="outline"
              disabled={loadingId === link.id}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          onClick={() => {
            toast.promise(
              async () => {
                setCreateLoading(true)
                await fetch(`/api/groups/${group.id}/invite-link`, {
                  method: "POST",
                })
                setCreateLoading(false)
                router.refresh()
              },
              {
                loading: "Создание...",
                success: "Ссылка создана",
                error: "Возникла ошибка при создании ссылки",
              }
            )
          }}
          disabled={createLoading}
        >
          Создать ссылку
        </Button>
      </div>
    </DrawerDialog>
  )
}
