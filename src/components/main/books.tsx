import { fetchBooks } from "@/lib/books"
import { validateRequest } from "@/lib/server-validate-request"
import { Book, BookMinus, ChevronRight } from "lucide-react"
import Link from "next/link"
import { BookView } from "@/components/book/book-view"

export async function Books() {
  const { user } = await validateRequest()
  if (!user) return null
  const books = (await fetchBooks(user.id))
    .filter((book) => book.readEvents[0]?.pagesRead !== book.pages)
    .slice(0, 3)
  return (
    <div className="flex cursor-default flex-col gap-3 border-b p-3">
      <Link href="/books">
        <h2 className="flex w-fit cursor-pointer flex-wrap items-center gap-1 text-3xl font-black hover:text-black/70 dark:hover:text-white/70">
          <Book className="mr-1 size-8" />
          Книги
          <ChevronRight className="size-8" />
        </h2>
      </Link>
      <div className="flex flex-col gap-2">
        {books.map((book) => (
          <BookView book={book} key={book.id} />
        ))}
      </div>
      {books.length === 0 && (
        <div className="flex items-center gap-2 rounded-xl border p-2 text-xl">
          <BookMinus className="size-10" />
          <div className="flex flex-col">
            <div>Нет книг</div>
            <div className="text-sm text-blue-500 underline underline-offset-4">
              <Link href="/books">Добавить книгу</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
