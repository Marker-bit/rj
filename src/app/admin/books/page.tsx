import { db } from "@/lib/db"
import { declOfNum } from "@/lib/utils"

export default async function Page() {
  const books = await db.book.findMany()
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Книги</h1>
        <p className="text-muted-foreground">
          {books.length} {declOfNum(books.length, ["книга", "книги", "книг"])}
        </p>
      </div>
    </div>
  )
}
