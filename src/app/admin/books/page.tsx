import { db } from "@/lib/db";
import { declOfNum } from "@/lib/utils";
import BookPagination from "./pagination";
import BookTable from "./table";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  let page = searchParams?.page ? parseInt(searchParams.page as string) : 1
  const pageSize = 20
  if (page < 1) {
    page = 1
  }
  const fullCount = await db.book.count()
  const totalPages = Math.ceil(fullCount / pageSize)
  if (page > totalPages) {
    page = totalPages
  }
  const books = await db.book.findMany({
    include: {
      user: true,
      groupBook: {
        include: {
          group: {
            include: {
              members: true,
            }
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Книги</h1>
        <p className="text-muted-foreground">
          {fullCount} {declOfNum(fullCount, ["книга", "книги", "книг"])}
        </p>
      </div>
      <BookTable books={books} />
      <BookPagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}
