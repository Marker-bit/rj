import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { declOfNum } from "@/lib/utils"
import { BookOpen, Check, ChevronLeft, UserCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
    },
  })

  booksSaved.sort(
    (a, b) =>
      (b.readEvents[0]?.pagesRead || 0) / b.pages -
      (a.readEvents[0]?.pagesRead || 0) / a.pages
  )

  return (
    <div className="p-8 flex flex-col">
      <Link href={`/groups/${params.groupId}`} className="mb-2">
        <Button className="w-fit items-center gap-2" variant="outline">
          <ChevronLeft className="w-4 h-4" />
          Назад
        </Button>
      </Link>
      <div className="flex gap-2 items-center">
        {member.user.avatarUrl && (
          <Image
            src={member.user.avatarUrl}
            alt="book"
            width={500}
            height={500}
            className="rounded-full h-20 w-auto"
          />
        )}
        <div className="flex flex-col">
          <div className="text-xl font-bold">
            {member.user.firstName} {member.user.lastName}
          </div>
          <div className="text-muted-foreground/90 text-sm">
            @{member.user.username}
          </div>
          <div className="text-muted-foreground/90 text-sm">
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
            <UserCircle className="w-4 h-4" />
            Профиль
          </Button>
        </Link>
      </div>

      <div className="w-full min-h-[20vh] bg-neutral-100 dark:bg-neutral-900 border rounded-xl p-4 mt-2">
        <div className="flex gap-2 items-center text-muted-foreground/90">
          <BookOpen className="w-4 h-4" />
          Книги
        </div>
        <div className="flex flex-col mt-2">
          {booksSaved.map((book, i) => (
            <div
              className="flex items-center p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-all gap-2"
              key={book.id}
            >
              {book.coverUrl && (
                <Image
                  src={book.coverUrl}
                  alt="book"
                  width={500}
                  height={500}
                  className="rounded-md h-20 w-auto"
                />
              )}
              <div className="flex flex-col">
                <div className="text-xl font-bold">{book.title}</div>
                <div className="text-muted-foreground/90 text-sm">
                  {book.author}
                </div>
                <div className="text-muted-foreground/90 text-sm">
                  {book.pages} стр.
                </div>
                <p className="text-muted-foreground/90 text-sm">
                  {book.description}
                </p>
              </div>
              {book.readEvents[0] && (
                <div className="flex flex-col ml-auto items-end">
                  {book.readEvents[0].pagesRead === book.pages ? (
                    <Check className="text-green-500 w-4 h-4" />
                  ) : (
                    <>
                      <div className="font-bold">
                        {book.readEvents[0].pagesRead}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        / {book.pages}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
