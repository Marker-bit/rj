import { Book, Collection } from "@prisma/client";
import { CollectionButtons } from "./collection-buttons";
import { declOfNum } from "@/lib/utils";

export async function Collection({
  collection,
}: {
  collection: Collection & {
    books: Book[];
  };
}) {
  return (
    <div className="flex flex-col border-b border-zinc-300 dark:border-zinc-700 rounded-b-xl p-3">
      <h1 className="text-xl font-bold">{collection.name}</h1>
      <div className="text-xs text-black/50">
        {collection.books.length}{" "}
        {declOfNum(collection.books.length, ["книга", "книги", "книг"])}
      </div>
      <CollectionButtons collection={collection} />
    </div>
  );
}
