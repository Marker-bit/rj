import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, dateToString, declOfNum } from "@/lib/utils"
import { Book, ReadEvent, User } from "@prisma/client"
import { BookCheck, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Event({
  event,
}: {
  event: ReadEvent & { book: Book & { user: User } }
}) {
  const book = event.book
  const user = book.user

  const fullyRead = event.pagesRead === book.pages

  return (
    <div className="flex flex-col gap-2 rounded-xl border p-2">
      <Link
        href={`/profile/${user.username}`}
        className="flex items-center gap-2"
      >
        <Avatar>
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>
            {user.firstName && user.firstName[0]}
            {user.lastName && user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-lg font-bold">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
        </div>
      </Link>
      <div className="flex gap-2">
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt="book"
            width={96}
            height={96}
            className="h-auto w-24 rounded-md max-sm:h-24 max-sm:w-auto"
          />
        )}
        <div className="flex flex-col">
          <div className="text-lg font-bold">{book.title}</div>
          <div className="text-sm text-muted-foreground">{book.author}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-12 p-2 items-center justify-center rounded-full border text-zinc-400 dark:text-zinc-600",
            fullyRead &&
              "border-green-200 dark:border-green-800 text-green-400 dark:text-green-600"
          )}
        >
          {fullyRead ? (
            <BookCheck className="size-5" />
          ) : (
            <BookOpen className="size-5" />
          )}
        </div>
        <div className="flex flex-col">
          {fullyRead ? (
            <>
              <div>Книга прочитана</div>
              <div className="text-sm text-muted-foreground">
                {book.pages}{" "}
                {declOfNum(book.pages, ["страница", "страницы", "страниц"])}
              </div>
            </>
          ) : (
            <>
              <div>
                {event.pagesRead}{" "}
                {declOfNum(event.pagesRead, [
                  "страница прочитана",
                  "страницы прочитаны",
                  "страниц прочитано",
                ])}
              </div>
              <div className="text-sm text-muted-foreground">
                из {book.pages}{" "}
                {declOfNum(book.pages, ["страницы", "страниц", "страниц"])}
              </div>
            </>
          )}

          <div className="text-sm text-muted-foreground">
            {dateToString(event.readAt)}
          </div>
        </div>
      </div>
    </div>
  )
}
