import Link from "next/link";
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
    return (
      <div className="m-3 flex flex-col items-start gap-3">
        <h1 className="text-2xl font-bold">Коллекция не найдена</h1>
        <p className="text-muted-foreground">
          Возможно, коллекция удалена или вам недоступна.
        </p>
        <Link href="/collections" className="underline underline-offset-4">
          Вернуться к коллекциям
        </Link>
      </div>
    );
  }

  return (
    <div className="max-sm:mb-[15vh]">
      <Link
        href="/collections"
        className="m-2 inline-block underline underline-offset-4"
      >
        Все коллекции
      </Link>
      <div className="flex flex-col border-b bg-neutral-100 p-2 dark:bg-neutral-900">
        <h1 className="text-5xl font-bold">{collection.name}</h1>
        <div className="text-muted-foreground">
          {collection.books.length}{" "}
          {declOfNum(collection.books.length, ["книга", "книги", "книг"])}
        </div>
      </div>
      {collection.books.length === 0 && (
        <p className="m-2 text-muted-foreground">
          В коллекции пока нет книг.
          {books.length > 0 && " Добавьте их из списка ниже."}
        </p>
      )}
      {books.length === 0 && (
        <p className="m-2 text-muted-foreground">
          {collection.books.length === 0
            ? "Сначала добавьте книги в свою библиотеку."
            : "Все книги вашей библиотеки уже в этой коллекции."}{" "}
          <Link href="/books" className="underline underline-offset-4">
            Перейти к книгам
          </Link>
        </p>
      )}
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
