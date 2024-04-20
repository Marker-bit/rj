import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import { fetchBooks } from "@/lib/books";
import { validateRequest } from "@/lib/server-validate-request";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { BookList } from "./book-list";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { bookId: string | undefined };
}) {
  const { user } = await validateRequest();
  if (!user) return null;

  const books = await fetchBooks(user.id);
  let bookId = searchParams?.bookId;

  return (
    <div>
      <div className="text-5xl font-black m-2 flex gap-2 items-center">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-8 h-8" />
          </Button>
        </Link>
        Книги
      </div>
      {bookId ? (
        <div className="p-2">
          <Link href="/books">
            <Button variant="ghost" className="items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Все книги
            </Button>
          </Link>
          <BookView book={books.find((b) => b.id === bookId)} />
        </div>
      ) : (
        <BookList books={books} />
      )}
    </div>
  );
}
