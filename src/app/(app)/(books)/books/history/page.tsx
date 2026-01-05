import { BookView } from "@/components/book/book-view";
import { fetchBooks } from "@/lib/books";
import { validateRequest } from "@/lib/server-validate-request";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user } = await validateRequest();
  if (!user) return null;

  const books = await fetchBooks(user.id, { history: true });
  const { bookReadId } = await searchParams;

  return (
    <div className="flex flex-col gap-2 p-2">
      <h1 className="text-3xl font-bold mb-2">История</h1>
      <p className="text-muted-foreground text-sm">
        Здесь хранятся все ваши прочитанные книги.
      </p>
      <div className="flex flex-col gap-2">
        {books.map((book) => (
          <BookView
            history
            key={book.id}
            book={book}
            initialReadOpen={book.id === bookReadId}
          />
        ))}
      </div>
    </div>
  );
}
