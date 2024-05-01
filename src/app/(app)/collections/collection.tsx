import { Book, Collection } from "@prisma/client"
import { CollectionButtons } from "./collection-buttons"
import { declOfNum } from "@/lib/utils"

export async function CollectionView({
  collection,
}: {
  collection: Collection & {
    books: Book[]
  }
}) {
  return (
    <div className="flex flex-col border-b rounded-b-xl p-3">
      <h1 className="text-xl font-bold">{collection.name}</h1>
      <div className="text-xs text-black/50 dark:text-white/50">
        {collection.books.length}{" "}
        {declOfNum(collection.books.length, ["книга", "книги", "книг"])}
      </div>
      <CollectionButtons collection={collection} />
    </div>
  )
}
