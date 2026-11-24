import { BookOpen, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookView } from "@/components/book/book-view";
import { CollectionIconTile } from "@/components/book/collection-mark";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { bookDetailHref, bookTagHref } from "@/lib/book-back";
import { fetchBookTag } from "@/lib/books";
import { requireUser } from "@/lib/require-user";
import { CollectionPageActions } from "./collection-page-actions";

export default async function BookTagPage({
  params,
}: {
  params: Promise<{ tagId: string }>;
}) {
  const { tagId } = await params;
  const user = await requireUser(bookTagHref(tagId));
  const tag = await fetchBookTag({ tagId, userId: user.id });
  if (!tag) notFound();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-2 pb-24 sm:pt-6">
      <Button variant="ghost" className="self-start" asChild>
        <Link href="/books">
          <ChevronLeft aria-hidden="true" />
          Все книги
        </Link>
      </Button>

      <header className="flex items-start gap-3">
        <CollectionIconTile icon={tag.icon} color={tag.color} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">Коллекция</p>
          <h1 className="wrap-anywhere text-3xl font-bold">{tag.name}</h1>
        </div>
        <CollectionPageActions
          collection={{
            id: tagId,
            name: tag.name,
            icon: tag.icon,
            color: tag.color,
            bookCount: tag.books.length,
          }}
        />
      </header>

      {tag.books.length ? (
        <ul className="flex flex-col gap-2">
          {tag.books.map((book) => (
            <li key={book.id}>
              <BookView
                book={book}
                titleHref={bookDetailHref(book.id, `tag:${tagId}`)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>В коллекции пока нет книг</EmptyTitle>
            <EmptyDescription>
              Добавьте книгу через меню коллекций в её карточке.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </main>
  );
}
