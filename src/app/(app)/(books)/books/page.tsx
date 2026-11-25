import { fetchBooks } from "@/lib/books";
import { requireUser } from "@/lib/require-user";
import { BookList } from "./book-list";
import { BooksPageActions } from "./books-page-actions";
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
        <BooksPageActions />
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
