import { DrawerDialog } from "@/components/drawer"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { MemberInfo } from "./member"

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

      <div className="mt-2 min-h-[20vh] w-full rounded-xl border bg-neutral-100/50 p-4 dark:bg-neutral-900/50">
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
            <MemberInfo
              key={member.userId}
              member={member}
              i={i}
              groupBook={groupBook}
              group={group}
              pages={ratingDict[member.userId]}
              savedBook={
                groupBook.book.find((b) => b.userId === member.userId)!
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
