import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { AddGroupButton } from "./add-group-button"
import { declOfNum } from "@/lib/utils"
import Link from "next/link"
import { redirect } from "next/navigation"
import { GroupMemberRole } from "@prisma/client"
import { BookMinus, Crown, Shield, Users2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function Page() {
  const { user } = await validateRequest()
  const groups = await db.group.findMany({
    where: {
      members: {
        some: {
          userId: user?.id,
        },
      },
    },
    include: {
      members: true,
      groupBooks: true,
      inviteLinks: true,
    },
  })

  if (groups.length === 1) {
    return redirect(`/groups/${groups[0].id}`)
  }

  return (
    <div className="flex flex-col max-sm:mb-[15vh]">
      <div className="m-2 flex items-center gap-2 text-3xl font-bold">
        <div>Группы чтения</div>
        <div className="ml-auto">
          <AddGroupButton />
        </div>
      </div>
      <div className="m-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {groups.map((g) => (
          <Link href={`/groups/${g.id}`} key={g.id}>
            <div
              key={g.id}
              className="flex flex-col gap-1 rounded-xl border p-2"
            >
              <div>{g.title}</div>
              <div className="flex gap-1 text-sm text-muted-foreground/70">
                <div>
                  {g.groupBooks.length}{" "}
                  {declOfNum(g.groupBooks.length, ["книга", "книги", "книг"])}
                </div>
                •
                <div>
                  {g.members.length}{" "}
                  {declOfNum(g.members.length, [
                    "участник",
                    "участника",
                    "участников",
                  ])}
                </div>
                {g.inviteLinks.length > 0 && (
                  <>
                    •
                    <div>
                      {g.inviteLinks.length}{" "}
                      {declOfNum(g.inviteLinks.length, [
                        "ссылка",
                        "ссылки",
                        "ссылок",
                      ])}
                    </div>
                  </>
                )}
                {g.members.find((m) => m.userId === user?.id)?.role !==
                  GroupMemberRole.MEMBER && (
                  <>
                    •
                    <div>
                      {g.members.find((m) => m.userId === user?.id)?.role ===
                      GroupMemberRole.MODERATOR ? (
                        <Shield className="size-4" />
                      ) : g.members.find((m) => m.userId === user?.id)?.role ===
                        GroupMemberRole.CREATOR ? (
                        <Crown className="size-4" />
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
        {groups.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl border p-2 text-xl">
            <Users2 className="size-10" />
            <div className="flex flex-col">
              <div>Вы не состоите ни в одной группе</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
