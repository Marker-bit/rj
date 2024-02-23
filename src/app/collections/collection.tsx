import { Book, Collection } from "@prisma/client";
import Link from "next/link";

export async function Collection({
  collection,
}: {
  collection: Collection & {
    books: Book[];
  };
}) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <div className="flex flex-col border-b border-zinc-300 rounded-b-xl p-3">
        <h1 className="text-xl font-bold">{collection.name}</h1>
        <div className="text-xs text-black/50">
          {collection.books.length} книг
        </div>
      </div>
    </Link>
  );
}
