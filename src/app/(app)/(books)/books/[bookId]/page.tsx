import { BookView } from "@/components/book/book-view";
import { Button } from "@/components/ui/button";
import { fetchBooks } from "@/lib/books";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ bookId: string }>;
}) {
  const params = await props.params;
  const { user } = await validateRequest();
  if (!user) return null;

  const book = await db.book.findUnique({
    where: {
      id: params.bookId,
      userId: user.id,
    },
    include: {
      readEvents: {
        orderBy: [
          { pagesRead: "desc" },
          {
            readAt: "desc",
          },
        ],
      },
      collections: true,
      groupBook: {
        include: {
          group: true,
        },
      },
      links: true,
    },
  });
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
