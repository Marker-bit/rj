import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import {
  BarChart2,
  BarChartHorizontalBig,
  Check,
  ChevronLeft,
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

  const book = await db.groupBook.findUnique({
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
  if (!book) {
    return null
  }

  const stats = [
    {
      title: "Читающих участников",
      description: "Участников, добавивших себе эту книгу",
      value: book.book.length,
      max: group.members.length,
    },
  ]

  let rating: { [key: string]: number } = {}

  group.members.forEach(
    (m) =>
      (rating[m.userId] =
        book.book.find((b) => b.userId === m.userId)?.readEvents[0]
          ?.pagesRead || 0)
  )

  const ratingKeys = new Array(...Object.keys(rating))

  ratingKeys.sort((a, b) => rating[b] - rating[a])

  return (
    <div className="flex flex-col p-8">
      <Link href={`/groups/${book.groupId}`} className="mb-2">
        <Button className="w-fit items-center gap-2">
          <ChevronLeft className="size-4" />
          Назад
        </Button>
      </Link>
      <div className="flex gap-2">
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt="book"
            width={500}
            height={500}
            className="h-40 w-auto rounded-md"
          />
        )}
        <div className="flex flex-col">
          <div className="text-xl font-bold">{book.title}</div>
          <div className="text-sm text-muted-foreground/90">{book.author}</div>
          <div className="text-sm text-muted-foreground/90">
            {book.pages} стр.
          </div>
          <p className="text-sm text-muted-foreground/90">{book.description}</p>
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
                  : (book.book.length / group.members.length) * 100
                ).toFixed(1)}
                %
              </div>
              <div className="text-sm text-muted-foreground/70">
                {book.book.length}/{group.members.length}
              </div>
            </div>
          </div>
          <Progress value={(book.book.length / group.members.length) * 100} />
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
                    : book.book.filter(
                        (book) => book.readEvents[0]?.pagesRead === book.pages
                      ).length / group.members.length) * 100
                ).toFixed(1)}
                %
              </div>
              <div className="text-sm text-muted-foreground/70">
                {
                  book.book.filter(
                    (book) => book.readEvents[0]?.pagesRead === book.pages
                  ).length
                }
                /{group.members.length}
              </div>
            </div>
          </div>
          <Progress
            value={
              (book.book.filter(
                (book) => book.readEvents[0]?.pagesRead === book.pages
              ).length /
                group.members.length) *
              100
            }
          />
        </div>
        <div className="mt-2 flex flex-col">
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
                {group.members.find((m) => m.userId === userId)?.user.username}
                <div className="ml-auto font-bold">
                  {rating[userId] === book.pages ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    rating[userId]
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
