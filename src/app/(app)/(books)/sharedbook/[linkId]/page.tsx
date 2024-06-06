import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { declOfNum } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { CloneButton } from "./clone-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function Page({ params }: { params: { linkId: string } }) {
  const { user } = await validateRequest()
  const book = await db.book.findFirst({
    where: { links: { some: { id: params.linkId } } },
    include: { readEvents: { orderBy: { readAt: "desc" } }, user: true },
  })
  if (!book) {
    return null
  }
  return (
    <div className="p-2 max-sm:mb-[15vh]">
      <div
        className="group relative flex gap-2 rounded-md border p-2"
        id={`book-${book.id}`}
      >
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt="book"
            width={500}
            height={500}
            className="h-40 w-auto rounded-md"
          />
        )}
        <div className="flex flex-col gap-1">
          <div className="text-3xl font-bold">{book.title}</div>
          <div className="-mt-1 text-zinc-500">{book.author}</div>
          {book.readEvents.length === 0 ? (
            <Badge className="w-fit">Запланирована</Badge>
          ) : book.readEvents[0]?.pagesRead === book.pages ? (
            <Badge className="w-fit">Прочитана</Badge>
          ) : (
            <Badge className="w-fit">
              {book.readEvents[0]?.pagesRead} / {book.pages}{" "}
              {declOfNum(book.pages, [
                "страница прочитана",
                "страницы прочитаны",
                "страниц прочитано",
              ])}
            </Badge>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={
                book.userId === user?.id
                  ? "/profile"
                  : `/profile/${book.user.username}`
              }
              className="w-fit"
            >
              <div className="flex w-fit gap-2 rounded-xl border p-2 pr-5">
                <Avatar>
                  <AvatarImage src={book.user?.avatarUrl} />
                  <AvatarFallback>
                    {book.user?.firstName && book.user?.firstName[0]}
                    {book.user?.lastName && book.user?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {book.userId === user?.id ? (
                  <div className="my-auto text-sm font-semibold">Вы</div>
                ) : (
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold">
                      {book.user.firstName} {book.user.lastName}
                    </div>
                    <div className="text-sm text-zinc-500">
                      @{book.user.username}
                    </div>
                  </div>
                )}
              </div>
            </Link>
            <CloneButton linkId={params.linkId} />
          </div>
        </div>
      </div>
    </div>
  )
}
