import { fetchBooks } from "@/lib/books";
import { validateRequest } from "@/lib/server-validate-request";
import BooksCard from "./cards/books-card";

export async function Books() {
  const { user } = await validateRequest();
  if (!user) return null;
  const books = (await fetchBooks(user.id))
    .filter(
      (book) => book.readEvents[0]?.pagesRead !== book.pages && !book.isHidden
    )
    .slice(0, 3);

  return <BooksCard books={books} />;
}
