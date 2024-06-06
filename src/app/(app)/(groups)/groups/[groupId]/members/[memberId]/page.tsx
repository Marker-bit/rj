import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { declOfNum } from "@/lib/utils"
import {
  BookOpen,
  Check,
  ChevronLeft,
  UserCircle,
  X,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ChangedInfo from "../../_components/changed-info"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = "force-dynamic"

export default async function Page({
  params,
}: {
  params: { groupId: string; memberId: string }
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
  const currentMember = group.members.find(
    (member) => member.userId === user.id
  )

  if (!currentMember) {
    return null
  }

  const member = await db.groupMember.findUnique({
    where: {
      groupId: params.groupId,
      id: params.memberId,
    },
    include: {
      user: true,
      booksAdded: true,
    },
  })

  if (!member) return null

  const booksSaved = await db.book.findMany({
    where: {
      userId: member.user.id,
      groupBook: {
        groupId: group.id,
      },
    },
    include: {
      readEvents: { orderBy: { readAt: "desc" } },
      groupBook: true,
    },
  })

  booksSaved.sort(
    (a, b) =>
      (b.readEvents[0]?.pagesRead || 0) / b.pages -
      (a.readEvents[0]?.pagesRead || 0) / a.pages
  )

  return (
    <div className="flex flex-col p-8 max-sm:mb-24">
      <Link href={`/groups/${params.groupId}`} className="mb-2">
        <Button className="w-fit items-center gap-2" variant="outline">
          <ChevronLeft className="size-4" />
          Назад
        </Button>
      </Link>
      <div className="flex items-center gap-2">
        <Avatar className="h-20 w-auto">
          <AvatarImage src={member.user?.avatarUrl} />
          <AvatarFallback>
            {member.user?.firstName && member.user?.firstName[0]}
            {member.user?.lastName && member.user?.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-xl font-bold">
            {member.user.firstName} {member.user.lastName}
          </div>
          <div className="text-sm text-muted-foreground/90">
            @{member.user.username}
          </div>
          <div className="text-sm text-muted-foreground/90">
            {booksSaved.length}{" "}
            {declOfNum(booksSaved.length, [
              "книга сохранена",
              "книги сохранены",
              "книг сохранено",
            ])}
          </div>
        </div>
        <Link href={`/profile/${member.user.username}`} className="ml-auto">
          <Button className="w-fit items-center gap-2">
            <UserCircle className="size-4" />
            Профиль
          </Button>
        </Link>
      </div>

      <div className="mt-2 min-h-[20vh] w-full rounded-xl border bg-neutral-100 p-4 dark:bg-neutral-900">
        <div className="flex items-center gap-2 text-muted-foreground/90">
          <BookOpen className="size-4" />
          Книги
        </div>
        <div className="mt-2 flex flex-col">
          {booksSaved.map((book, i) => (
            <div
              className="flex items-center gap-2 rounded-md p-2"
              key={book.id}
            >
              {book.coverUrl && (
                <Image
                  src={book.coverUrl}
                  alt="book"
                  width={500}
                  height={500}
                  className="h-20 w-auto rounded-md"
                />
              )}
              <div className="flex flex-col">
                <div className="text-xl font-bold">{book.title}</div>
                <div className="text-sm text-muted-foreground/90">
                  {book.author}
                </div>
                <div className="text-sm text-muted-foreground/90">
                  {book.pages} стр.
                </div>
                <p className="text-sm text-muted-foreground/90">
                  {book.description}
                </p>
                {book.groupBook && (
                  <ChangedInfo
                    groupBook={book.groupBook}
                    book={book}
                    currentMember={currentMember}
                    member={member}
                  />
                )}
              </div>

              <div className="ml-auto flex flex-col items-end">
                {book.readEvents.length === 0 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <XCircle className="size-4 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Человек добавил себе эту книгу, но не читал её.
                    </TooltipContent>
                  </Tooltip>
                ) : book.readEvents[0].pagesRead === book.pages ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Check className="size-4 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Человек полностью прочитал книгу.
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <div className="font-bold">
                      {book.readEvents[0].pagesRead}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      / {book.pages}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
