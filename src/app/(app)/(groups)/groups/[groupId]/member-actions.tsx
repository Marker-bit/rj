"use client"

import { DrawerDialog } from "@/components/ui/drawer-dialog"
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
import { MoreVertical, ShieldMinus, ShieldPlus, UserX } from "lucide-react"
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

  // const changeRole = async (role: GroupMemberRole) => {
  //   setLoading(true)
  //   const resp = await fetch(`/api/groups/${groupId}/member/${member.id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ role }),
  //   })
  //   const res = await resp.json()
  //   setLoading(false)
  //   if (res.error) {
  //     toast.error("Возникла проблема при изменении роли участника", {
  //       description: res.error,
  //     })
  //   } else {
  //     toast.success(res.message)
  //     router.refresh()
  //   }
  // }

  const changeRole = async (role: GroupMemberRole) => {
    toast.promise(async () => {
      const resp = await fetch(`/api/groups/${groupId}/member/${member.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })
      const res = await resp.json()
      if (res.error) {
        throw new Error(res.error)
      } else {
        router.refresh()
        return res
      }
    }, {
      loading: "Изменение роли участника...",
      success: "Роль участника изменена",
      error: (error) => `Возникла проблема при изменении роли участника: ${error.message}`,
    })
    // setLoading(true)
    // const resp = await fetch(`/api/groups/${groupId}/member/${member.id}`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ role }),
    // })
    // const res = await resp.json()
    // setLoading(false)
    // if (res.error) {
    //   toast.error("Возникла проблема при изменении роли участника", {
    //     description: res.error,
    //   })
    // } else {
    //   toast.success(res.message)
    //   router.refresh()
    // }
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
            <UserX className="size-4" />
            Исключить
          </DropdownMenuItem>
          {member.role === GroupMemberRole.MODERATOR && (
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => changeRole(GroupMemberRole.MEMBER)}
            >
              <ShieldMinus className="size-4" />
              Понизить
            </DropdownMenuItem>
          )}
          {member.role === GroupMemberRole.MEMBER && (
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => changeRole(GroupMemberRole.MODERATOR)}
            >
              <ShieldPlus className="size-4" />
              Повысить
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
