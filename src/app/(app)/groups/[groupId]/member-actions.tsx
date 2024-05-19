"use client"

import { DrawerDialog } from "@/components/drawer"
import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader } from "@/components/ui/loader"
import { GroupMemberRole } from "@prisma/client"
import { MoreVertical, UserX } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function MemberActions({
  member,
  groupId,
}: {
  member: { id: string; role: GroupMemberRole; user: { username: string } }
  groupId: string
}) {
  const [loading, setLoading] = useState(false)
  const [kickOpen, setKickOpen] = useState(false)
  const router = useRouter()

  const kickMember = async () => {
    setLoading(true)
    const resp = await fetch(`/api/groups/${groupId}/member/${member.id}`, {
      method: "DELETE",
    })
    const res = await resp.json()
    setLoading(false)
    if (res.error) {
      toast.error("Возникла проблема при исключении участника", {
        description: res.error,
      })
    } else {
      setKickOpen(false)
      toast.success(res.message)
      router.refresh()
    }
  }

  return (
    <>
      <DrawerDialog
        open={kickOpen}
        onOpenChange={setKickOpen}
        className="min-w-[50vw]"
      >
        <DialogHeader className="mb-2">
          <DialogTitle>Исключить участника</DialogTitle>
        </DialogHeader>
        <p>
          Вы уверены, что хотите исключить участника @{member.user.username}?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={kickMember}
          >
            {loading ? (
              <Loader white className="size-4" />
            ) : (
              <UserX className="size-4" />
            )}
            <p className="max-sm:hidden">Исключить</p>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setKickOpen(false)}
          >
            Отмена
          </Button>
        </div>
      </DrawerDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-fit p-1">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setKickOpen(true)}
          >
            {loading ? (
              <Loader className="size-4" />
            ) : (
              <UserX className="size-4" />
            )}
            Исключить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
