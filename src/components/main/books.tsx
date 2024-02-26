import { BookView } from "@/components/book/book-view";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { BookMinus, ChevronRight } from "lucide-react";
import Link from "next/link";

export async function Books() {
  const { user } = await validateRequest();
  if (!user) return null;
  const books = await db.book.findMany({
    where: {
      userId: user.id,
    },
    take: 3,
    include: {
      readEvents: true,
      collections: true,
    },
  });
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
      <Link href="/books">
        <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit flex-wrap">
          Книги
          <ChevronRight className="w-12 h-12" strokeWidth={3} />
        </h2>
      </Link>
      <div className="flex flex-col gap-2">
        {books.map((book) => (
          <BookView book={book} key={book.id} />
        ))}
      </div>
      {books.length === 0 && (
        <div className="p-2 flex gap-2 items-center rounded-xl border border-zinc-200 text-xl">
          <BookMinus className="w-10 h-10" />
          <div className="flex flex-col">
            <div>Нет книг</div>
            <div className="text-sm text-blue-500 underline underline-offset-4">
              <Link href="/books">Добавить книгу</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
