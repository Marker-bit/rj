import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { declOfNum } from "@/lib/utils"
import { BadgeCheck, Check, Home } from "lucide-react"
import Image from "next/image"
import { JoinGroupButton } from "./buttons"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function Page({ params }: { params: { linkId: string } }) {
  const { user } = await validateRequest()
  if (!user) return null

  const link = await db.groupInviteLink.findUniqueOrThrow({
    where: {
      id: params.linkId,
    },
    include: {
      group: {
        include: {
          members: true,
          blockedUsers: true,
        },
      },
      createdBy: {
        include: {
          user: true,
        },
      },
    },
  })

  if (link.group.members.some((member) => member.userId === user.id)) {
    return redirect(`/groups/${link.group.id}`)
  }
  return (
    <div className="flex flex-col p-4 max-sm:mb-[15vh] md:min-h-screen md:items-center md:justify-center">
      <div className="flex flex-col gap-2 rounded-xl border p-4 max-sm:w-full md:m-1 md:min-w-[30vw]">
        <h1 className="text-3xl font-bold">Приглашение</h1>
        <div className="flex flex-col rounded-xl border p-2">
          <p className="text-xs text-muted-foreground">Группа</p>
          <p className="text-2xl font-medium">{link.group.title}</p>
          <p className="text-xs text-muted-foreground">
            {link.group.members.length}{" "}
            {declOfNum(link.group.members.length, [
              "участник",
              "участника",
              "участников",
            ])}
          </p>
        </div>
        <div className="flex flex-col rounded-xl border p-2">
          <p className="flex gap-2 text-xs text-muted-foreground">
            Пригласил вас{" "}
            {link.createdBy.user.verified && (
              <BadgeCheck className="size-4 text-yellow-500" />
            )}
          </p>
          <div className="flex items-center gap-2">
            <Image
              src={link.createdBy.user.avatarUrl || "/no-avatar.png"}
              width={40}
              height={40}
              alt="user avatar"
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-2xl font-medium">
                {link.createdBy.user.firstName} {link.createdBy.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                @{link.createdBy.user.username}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <JoinGroupButton link={link} user={user} />
          <Link href="/home">
            <Button className="items-center gap-2" variant="outline">
              <Home className="size-4" />
              На главную
            </Button>
          </Link>
        </div>
        {link.group.blockedUsers.some((u) => u.id === user.id) && (
          <p className="rounded-xl border border-red-300 bg-red-200 p-4 text-xs text-red-500 dark:border-red-900 dark:bg-red-950">
            Вы были заблокированы в этой группе
          </p>
        )}
      </div>
    </div>
  )
}
