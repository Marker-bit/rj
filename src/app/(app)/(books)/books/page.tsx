import { ArchiveIcon, ArrowRightIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { fetchBooks } from "@/lib/books";
import { requireUser } from "@/lib/require-user";
import { BookList } from "./book-list";
import AddBookButton from "./button";
import HiddenBooksCollapsible from "./hidden-books-collapsible";
import { BookStatus } from "@/generated/prisma/enums";

export default async function BooksPage() {
  const user = await requireUser();

  const books = await fetchBooks(user.id);

  const hiddenBooks = books?.filter((b) => b.status === BookStatus.HIDDEN);

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold mb-2">Книги</h1>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <AddBookButton />
          <SimpleTooltip
            className="max-w-45"
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
          <SimpleTooltip
            className="max-w-45"
            text="Здесь хранятся все ваши архивированные книги"
          >
            <Button className="group" variant="secondary" asChild>
              <Link href="/books/archive">
                <ArchiveIcon
                  className="opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Архив
                <ArrowRightIcon
                  className="opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </SimpleTooltip>
        </div>
        <BookList
          books={books?.filter((b) => b.status === BookStatus.NONE) ?? []}
        />
        {(hiddenBooks?.length ?? 0) > 0 && (
          <HiddenBooksCollapsible hiddenBooks={hiddenBooks!} />
        )}
      </div>
    </div>
  );
}
