import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import { fetchBooks } from "@/lib/books";
import { validateRequest } from "@/lib/server-validate-request";
import { ChevronLeft, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { BookList } from "./book-list";
import AddBookButton from "./button";
import { loadSearchParams } from "./search-params";
import { SearchParams } from "nuqs/server";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import HiddenBooksCollapsible from "./hidden-books-collapsible";

export default async function BooksPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const { user } = await validateRequest();
  if (!user) return null;

  const { sort } = loadSearchParams(searchParams);
  if (!["percent", "activity"].includes(sort)) {
    return null;
  }
  const books = await fetchBooks(user.id, sort as "percent" | "activity");

  let bookId = searchParams?.bookId;

  const foundBook = bookId ? books.find((b) => b.id === bookId) : undefined;

  const hiddenBooks = books.filter((b) => b.isHidden);

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
          {hiddenBooks.length > 0 && (
            <HiddenBooksCollapsible hiddenBooks={hiddenBooks} />
          )}
        </>
      )}
    </div>
  );
}
