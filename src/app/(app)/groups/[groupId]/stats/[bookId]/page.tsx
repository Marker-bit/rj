import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import {
  BadgeCheck,
  BarChart2,
  BarChartHorizontalBig,
  Check,
  ChevronLeft,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Page({
  params,
}: {
  params: { groupId: string; bookId: string }
}) {
  const { user } = await validateRequest()
  if (!user) {
    return null
  }

  const group = await db.group.findUnique({
    where: { id: params.groupId, members: { some: { userId: user.id } } },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      groupBooks: {
        include: {
          book: {
            include: {
              readEvents: {
                orderBy: { readAt: "desc" },
              },
            },
          },
        },
      },
    },
  })
  if (!group) {
    return null
  }

  const groupBook = await db.groupBook.findUnique({
    where: { id: params.bookId, groupId: params.groupId },
    include: {
      group: true,
      book: {
        include: {
          user: true,
          readEvents: {
            orderBy: { readAt: "desc" },
          },
        },
      },
    },
  })
  if (!groupBook) {
    return null
  }

  const stats = [
    {
      title: "Читающих участников",
      description: "Участников, добавивших себе эту книгу",
      value: groupBook.book.length,
      max: group.members.length,
    },
  ]

  let ratingDict: Record<string, number | null> = {}

  group.members.forEach((m) => {
    const book = groupBook.book.find((b) => b.userId === m.userId)

    ratingDict[m.userId] =
      book === undefined
        ? null
        : book.readEvents.length === 0
        ? 0
        : book.readEvents[0].pagesRead
  })

  const ratingKeys = new Array(...Object.keys(ratingDict))

  ratingKeys.sort((a, b) => (ratingDict[b] || 0) - (ratingDict[a] || 0))

  const rating = ratingKeys.map(
    (key) => group.members.find((m) => m.userId === key)!
  )

  return (
    <div className="flex flex-col p-8 max-sm:mb-24">
      <Link href={`/groups/${groupBook.groupId}`} className="mb-2">
        <Button className="w-fit items-center gap-2">
          <ChevronLeft className="size-4" />
          Назад
        </Button>
      </Link>
      <div className="flex gap-2">
        {groupBook.coverUrl && (
          <Image
            src={groupBook.coverUrl}
            alt="book"
            width={500}
            height={500}
            className="h-40 w-auto rounded-md"
          />
        )}
        <div className="flex flex-col">
          <div className="text-xl font-bold">{groupBook.title}</div>
          <div className="text-sm text-muted-foreground/90">
            {groupBook.author}
          </div>
          <div className="text-sm text-muted-foreground/90">
            {groupBook.pages} стр.
          </div>
          <p className="text-sm text-muted-foreground/90">
            {groupBook.description}
          </p>
        </div>
      </div>

      <div className="mt-2 min-h-[20vh] w-full rounded-xl border bg-neutral-100 p-4 dark:bg-neutral-900">
        <div className="flex items-center gap-2 text-muted-foreground/90">
          <BarChartHorizontalBig className="size-4" />
          Статистика
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="text-xl">Читающих участников</div>
              <div className="text-sm text-muted-foreground/70">
                Участников, добавивших себе эту книгу
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xl font-bold">
                {(group.members.length === 0
                  ? 0
                  : (groupBook.book.length / group.members.length) * 100
                ).toFixed(1)}
                %
              </div>
              <div className="text-sm text-muted-foreground/70">
                {groupBook.book.length}/{group.members.length}
              </div>
            </div>
          </div>
          <Progress
            value={(groupBook.book.length / group.members.length) * 100}
          />
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="text-xl">Прочитавших участников</div>
              <div className="text-sm text-muted-foreground/70">
                Участников, полностью прочитавших эту книгу
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xl font-bold">
                {(
                  (group.members.length === 0
                    ? 0
                    : groupBook.book.filter(
                        (book) => book.readEvents[0]?.pagesRead === book.pages
                      ).length / group.members.length) * 100
                ).toFixed(1)}
                %
              </div>
              <div className="text-sm text-muted-foreground/70">
                {
                  groupBook.book.filter(
                    (book) => book.readEvents[0]?.pagesRead === book.pages
                  ).length
                }
                /{group.members.length}
              </div>
            </div>
          </div>
          <Progress
            value={
              (groupBook.book.filter(
                (book) => book.readEvents[0]?.pagesRead === book.pages
              ).length /
                group.members.length) *
              100
            }
          />
        </div>
        <div className="mt-2 flex flex-col">
          {rating.map((member, i) => (
            <Link
              key={member.userId}
              href={`/groups/${group.id}/members/${member.id}`}
            >
              <div className="flex items-center gap-2 rounded-md p-2 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                <div className="relative">
                  <Image
                    src={member.user.avatarUrl || "/no-avatar.png"}
                    alt="user"
                    width={500}
                    height={500}
                    className="h-8 w-auto rounded-md"
                  />
                  <div className="absolute bottom-0 right-0 flex size-4 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border bg-white text-xs dark:bg-black">
                    {i + 1}
                  </div>
                </div>
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
                <div className="ml-auto font-bold">
                  {ratingDict[member.userId] === null ? (
                    <X className="size-4 text-red-500" />
                  ) : ratingDict[member.userId] === groupBook.pages ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    ratingDict[member.userId]! < groupBook.pages &&
                    ratingDict[member.userId]
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
