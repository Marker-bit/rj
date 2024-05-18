import { BookView } from "@/components/book/book-view"
import { Button } from "@/components/ui/button"
import { fetchBooks } from "@/lib/books"
import { validateRequest } from "@/lib/server-validate-request"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { BookList } from "./book-list"

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { bookId: string | undefined }
}) {
  const { user } = await validateRequest()
  if (!user) return null

  const books = await fetchBooks(user.id)
  let bookId = searchParams?.bookId

  const foundBook = bookId ? books.find((b) => b.id === bookId) : undefined

  return (
    <div className="max-sm:mb-[15vh]">
      <div className="m-2 flex items-center gap-2 text-5xl font-black">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="size-8" />
          </Button>
        </Link>
        Книги
      </div>
      {bookId ? (
        <div className="p-2">
          <Link href="/books">
            <Button variant="ghost" className="items-center gap-2">
              <ChevronLeft className="size-4" />
              Все книги
            </Button>
          </Link>
          {foundBook ? (
            <BookView book={foundBook} />
          ) : (
            <div>Книга не найдена</div>
          )}
        </div>
      ) : (
        <BookList books={books} />
      )}
    </div>
  )
}
