import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { fetchBook, fetchBooks } from "@/lib/books";
import { validateRequest } from "@/lib/server-validate-request";
import { ArrowRightIcon, ChevronLeft, HistoryIcon } from "lucide-react";
import Link from "next/link";
import { BookList } from "./book-list";
import AddBookButton from "./button";
import HiddenBooksCollapsible from "./hidden-books-collapsible";

export default async function BooksPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort = searchParams?.sort;
  const { user } = await validateRequest();
  if (!user) return null;
  if (
    sort &&
    typeof sort === "string" &&
    !["percent", "activity"].includes(sort)
  ) {
    return null;
  }

  let bookId = searchParams?.bookId;

  const books = bookId
    ? null
    : await fetchBooks(user.id, {
        orderBy: sort as "percent" | "activity",
      });

  const foundBook = bookId && (await fetchBook(bookId as string, user.id));

  const hiddenBooks = bookId ? null : books!.filter((b) => b.isHidden);

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold mb-2">Книги</h1>
      {bookId ? (
        <>
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
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <AddBookButton />
            <SimpleTooltip
              className="max-w-[180px]"
              text="Здесь хранятся все ваши прочитанные книги"
            >
              <Button className="group" variant="secondary" asChild>
                <Link href="/books/history">
                  <HistoryIcon
                    className="opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  История
                  <ArrowRightIcon
                    className="opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </SimpleTooltip>
          </div>
          <BookList books={books!.filter((b) => !b.isHidden)} />
          {hiddenBooks!.length > 0 && (
            <HiddenBooksCollapsible hiddenBooks={hiddenBooks!} />
          )}
        </div>
      )}
    </div>
  );
}
