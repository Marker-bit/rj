import { ArchiveIcon } from "lucide-react";
import Link from "next/link";
import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { fetchBooks } from "@/lib/books";
import { requireUser } from "@/lib/require-user";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireUser();

  const books = await fetchBooks(user.id, { archive: true });
  const { bookReadId } = await searchParams;

  return (
    <div className="flex flex-col gap-2 p-2">
      <h1 className="text-3xl font-bold mb-2">Архив</h1>
      <p className="text-muted-foreground text-sm">
        Здесь хранятся все книги, которые вы отложили в архив.
      </p>
      <div className="flex flex-col gap-2">
        {books.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ArchiveIcon />
              </EmptyMedia>
              <EmptyTitle>Пока нет книг</EmptyTitle>
              <EmptyDescription>
                Книги, отложенные в архив, появятся здесь.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline">
                <Link href="/books">К списку книг</Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}
        {books.map((book) => (
          <BookView
            key={book.id}
            book={book}
            initialReadOpen={book.id === bookReadId}
          />
        ))}
      </div>
    </div>
  );
}
