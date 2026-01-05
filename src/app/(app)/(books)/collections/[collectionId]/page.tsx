import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { declOfNum } from "@/lib/utils";
import { AddBook } from "./add-book";
import { RemoveBook } from "./remove-book";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ collectionId: string }>;
}) {
  const params = await props.params;
  const { user } = await validateRequest();
  const books = await db.book.findMany({
    where: {
      userId: user?.id,
      collections: {
        none: {
          id: params.collectionId,
        },
      },
    },
  });
  const collection = await db.collection.findUnique({
    where: {
      id: params.collectionId,
      userId: user?.id,
    },
    include: {
      books: true,
    },
  });

  if (!collection) {
    return null;
  }

  return (
    <div className="max-sm:mb-[15vh]">
      <div className="flex flex-col border-b bg-neutral-100 p-2 dark:bg-neutral-900">
        <h1 className="text-5xl font-bold">{collection.name}</h1>
        <div className="text-muted-foreground/50">
          {collection.books.length}{" "}
          {declOfNum(collection.books.length, ["книга", "книги", "книг"])}
        </div>
      </div>
      {collection.books.length !== 0 && (
        <div className="m-2 flex flex-col">
          <h2 className="text-3xl">Книги в коллекции</h2>
          {collection.books.map((book) => (
            <RemoveBook key={book.id} book={book} collection={collection} />
          ))}
        </div>
      )}
      {books.length !== 0 && (
        <div className="m-2 flex flex-col">
          <h2 className="text-3xl">Остальные книги</h2>
          {books.map((book) => (
            <AddBook key={book.id} book={book} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}
