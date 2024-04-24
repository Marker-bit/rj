import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { declOfNum } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }: { params: { bookId: string } }) {
  const { user } = await validateRequest();
  const book = await db.book.findUnique({
    where: { id: params.bookId },
    include: { readEvents: { orderBy: { readAt: "desc" } }, user: true },
  });
  if (!book) {
    return null;
  }
  return (
    <div className="p-2">
      <div
        className="border p-2 rounded-md flex gap-2 group relative"
        id={`book-${book.id}`}
      >
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt="book"
            width={500}
            height={500}
            className="rounded-md h-40 w-auto"
          />
        )}
        <div className="flex flex-col gap-1">
          <div className="text-3xl font-bold">{book.title}</div>
          <div className="text-zinc-500 -mt-1">{book.author}</div>
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

          <Link
            href={
              book.userId === user?.id
                ? "/profile"
                : `/profile/${book.user.username}`
            }
            className="w-fit"
          >
            <div className="rounded-xl border p-2 flex gap-2 w-fit pr-5">
              <Image
                src={user?.avatarUrl || "/no-avatar.png"}
                alt="user"
                width={500}
                height={500}
                className="rounded-full w-10 h-10"
              />
              {book.userId === user?.id ? (
                <div className="text-sm font-semibold my-auto">Вы</div>
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
        </div>
      </div>
    </div>
  );
}
