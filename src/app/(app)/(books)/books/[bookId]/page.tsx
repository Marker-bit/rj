import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/require-user";
import { fetchBook } from "@/lib/books";

export default async function Page(props: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await props.params;
  const user = await requireUser();

  const book = await fetchBook(bookId, user.id);
  if (!book) return notFound();

  return (
    <div className="p-2 max-sm:mb-[15vh]">
      <Button variant="ghost" asChild className="mb-2 items-center gap-2">
        <Link href="/books">
          <ChevronLeft className="size-4" />
          Все книги
        </Link>
      </Button>
      <BookView book={book} />
    </div>
  );
}
