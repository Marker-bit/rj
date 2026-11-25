"use client";

import { BookOrderSelect } from "@/components/book/book-order-select";
import { BookView } from "@/components/book/book-view";
import { useBookOrder } from "@/hooks/use-book-order";
import type { Book } from "@/lib/api-types";
import { bookDetailHref } from "@/lib/book-back";
import { sortBooks } from "@/lib/book-order";

export function CollectionBookList({
  books,
  tagId,
}: {
  books: Book[];
  tagId: string;
}) {
  const [sort, setSort] = useBookOrder();

  return (
    <>
      <div className="sm:self-start">
        <BookOrderSelect sort={sort} onChange={setSort} />
      </div>
      <ul className="flex flex-col gap-2">
        {sortBooks(books, sort).map((book) => (
          <li key={book.id}>
            <BookView
              book={book}
              titleHref={bookDetailHref(book.id, `tag:${tagId}`)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
