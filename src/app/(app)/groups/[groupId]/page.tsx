import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { declOfNum } from "@/lib/utils"
import { GroupMemberRole } from "@prisma/client"
import {
  BadgeCheck,
  BarChart2,
  BarChartHorizontalBig,
  Book,
  Crown,
  LogOut,
  Shield,
  User,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AddBookButton } from "./add-book-button"
import { AddMemberButton } from "./add-member-button"
import { GroupBookView } from "./book-view"
import { Progress } from "@/components/ui/progress"
import { LinkMemberButton } from "./link-member-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LeaveGroupButton } from "./leave-group-button"
import { DeleteGroupButton } from "./delete-group-button"

export const dynamic = "force-dynamic"

export default async function Page({
  params,
}: {
  params: { groupId: string }
}) {
  const { user } = await validateRequest()
  if (!user) {
    return null
  }
  const group = await db.group.findUnique({
    where: { id: params.groupId },
    include: {
      groupBooks: {
        include: {
          group: true,
          book: {
            include: {
              readEvents: {
                orderBy: { readAt: "desc" },
              },
            },
          },
        },
      },
      members: {
        include: {
          user: {
            include: {
              books: {
                include: {
                  groupBook: true,
                },
              },
            },
          },
        },
      },
      inviteLinks: true,
    },
  })
  if (!group) {
    return null
  }
  const myBooksFromGroup = await db.book.findMany({
    where: {
      userId: user?.id,
      groupBook: {
        groupId: group.id,
      },
    },
    include: {
      readEvents: {
        orderBy: { readAt: "desc" },
      },
    },
  })

  const isMember = group.members.some(
    (m) => m.userId === user?.id && m.role === GroupMemberRole.MEMBER
  )

  const activeMembers = group.members.filter(
    (m) =>
      m.user.books.filter((b) => b.groupBook?.groupId === group.id).length > 0
  )

  const activeBooks = group.groupBooks.filter(
    (b) => b.book.length === group.members.length
  )

  const stats = [
    {
      title: "Активных пользователей",
      description: "Участников, добавивших себе книги",
      value: activeMembers.length,
      max: group.members.length,
    },
    {
      title: "Активных книг",
      description: "Книг, которые сохранили все участники",
      value: activeBooks.length,
      max: group.groupBooks.length,
    },
  ]

  const allBooks = group.groupBooks.map((b) => b.book).flat()

  let rating: { [key: string]: number } = {}

  group.members.forEach(
    (m) =>
      (rating[m.user.id] = allBooks
        .filter((b) => b.userId === m.user.id)
        .map((book) => book.readEvents[0]?.pagesRead || 0)
        .reduce((a, b) => a + b, 0))
  )

  const ratingKeys = new Array(...Object.keys(rating))

  ratingKeys.sort((a, b) => rating[b] - rating[a])

  return (
    <div className="p-2 max-sm:mb-[15vh]">
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="text-3xl font-bold">
            <div>{group.title}</div>
          </div>
          <div className="flex gap-1 text-sm text-muted-foreground/70">
            <div>
              {group.groupBooks.length}{" "}
              {declOfNum(group.groupBooks.length, ["книга", "книги", "книг"])}
            </div>
            •
            <div>
              {group.members.length}{" "}
              {declOfNum(group.members.length, [
                "участник",
                "участника",
                "участников",
              ])}
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <LeaveGroupButton groupId={group.id} />
            </TooltipTrigger>
            <TooltipContent>Выйти из группы</TooltipContent>
          </Tooltip>
          {group.members.find((m) => m.userId === user.id)?.role ===
            GroupMemberRole.CREATOR && (
            <Tooltip>
              <TooltipTrigger>
                <DeleteGroupButton groupId={group.id} />
              </TooltipTrigger>
              <TooltipContent>Удалить группу</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
            <Book className="size-4" />
            <div>Книги</div>
            {!isMember && <AddBookButton groupId={group.id} />}
          </div>
          <ScrollArea className="h-[40vh]">
            {group.groupBooks.map((book) => (
              <GroupBookView
                groupBook={book}
                key={book.id}
                ownedBooks={myBooksFromGroup}
                isMember={isMember}
                userId={user.id}
              />
            ))}
          </ScrollArea>
        </div>
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
            <Users className="size-4" />
            <div>Участники</div>
            <div className="ml-auto flex items-center gap-2">
              <AddMemberButton group={group} isMember={isMember} />
              <LinkMemberButton group={group} isMember={isMember} />
            </div>
          </div>
          <ScrollArea className="h-[40vh]">
            {group.members.map((member) => (
              <Link
                href={`/profile/${member.user.username}`}
                key={member.id}
                className="mt-2 flex items-center gap-2 rounded-xl p-2 transition-all hover:bg-muted"
              >
                <Image
                  src={member.user.avatarUrl || "/no-avatar.png"}
                  alt="user"
                  width={500}
                  height={500}
                  className="h-8 w-auto rounded-md"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 font-bold">
                    {member.user.firstName} {member.user.lastName}
                    {member.user.verified && (
                      <BadgeCheck className="size-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground/70">
                    @{member.user.username}
                  </div>
                </div>
                <div className="ml-auto flex gap-1">
                  {member.userId === user?.id && <User className="size-4" />}
                  {member.role === GroupMemberRole.MODERATOR && (
                    <Shield className="size-4 text-blue-500" />
                  )}
                  {member.role === GroupMemberRole.CREATOR && (
                    <Crown className="size-4 text-yellow-500" />
                  )}
                </div>
              </Link>
            ))}
          </ScrollArea>
        </div>
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
            <BarChartHorizontalBig className="size-4" />
            <div>Статистика</div>
          </div>
          {stats.map((stat) => (
            <div className="mt-2 flex flex-col gap-2" key={stat.title}>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="text-xl">{stat.title}</div>
                  <div className="text-sm text-muted-foreground/70">
                    {stat.description}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xl font-bold">
                    {(stat.max === 0
                      ? 0
                      : (stat.value / stat.max) * 100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground/70">
                    {stat.value}/{stat.max}
                  </div>
                </div>
              </div>
              <Progress value={(stat.value / stat.max) * 100} />
            </div>
          ))}
        </div>
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-1 text-sm text-black/70 dark:text-white/70">
            <BarChart2 className="size-4" />
            <div>Рейтинг</div>
          </div>
          <ScrollArea className="mt-2 flex h-[40vh] flex-col">
            {ratingKeys.map((userId, i) => (
              <Link
                key={userId}
                href={`/groups/${group.id}/members/${
                  group.members.find((m) => m.userId === userId)?.id
                }`}
              >
                <div className="flex items-center gap-2 rounded-md p-2 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                  <div className="flex size-6 items-center justify-center rounded-full border">
                    {i + 1}
                  </div>
                  <div className="flex gap-2">
                    {
                      group.members.find((m) => m.userId === userId)?.user
                        .username
                    }

                    {group.members.find((m) => m.userId === userId)?.user
                      .verified && (
                      <BadgeCheck className="size-6 text-yellow-500" />
                    )}
                  </div>

                  <div className="ml-auto flex flex-col items-end">
                    <div className="font-bold">{rating[userId]}</div>
                    <div className="text-sm text-muted-foreground">
                      {
                        group.groupBooks.filter((groupBook) =>
                          groupBook.book.find(
                            (book) =>
                              book.userId === userId &&
                              book.readEvents[0]?.pagesRead === book.pages
                          )
                        ).length
                      }{" "}
                      / {group.groupBooks.length}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
