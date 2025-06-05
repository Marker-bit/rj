import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import { fetchBooks } from "@/lib/books";
import { validateRequest } from "@/lib/server-validate-request";
import { ChevronLeft, ChevronRight, HistoryIcon } from "lucide-react";
import Link from "next/link";
import { BookList } from "./book-list";
import AddBookButton from "./button";

export default async function BooksPage(props: {
  searchParams: Promise<{ bookId: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { user } = await validateRequest();
  if (!user) return null;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const books = await fetchBooks(user.id);
  let bookId = searchParams?.bookId;

  const foundBook = bookId ? books.find((b) => b.id === bookId) : undefined;

  return (
    <div className="max-sm:mb-[15vh]">
      <div className="m-2 flex items-center gap-2 text-5xl font-black">
        <Link href="/home">
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
        <>
          <AddBookButton />
          <BookList books={books.filter((b) => !b.isHidden)} />
          {books.filter((b) => b.isHidden).length > 0 && (
            <div className="m-2">
              <h2 className="text-2xl font-bold">Скрытые</h2>
              <p className="mb-2 text-muted-foreground">
                Книги, которые вы скрыли
              </p>
              <div className="flex flex-col gap-2">
                {books
                  .filter((b) => b.isHidden)
                  .map((b) => (
                    <BookView key={b.id} book={b} />
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
