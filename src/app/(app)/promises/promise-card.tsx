import { Book, ReadPromise } from "@prisma/client"

export default function PromiseCard({
  promise,
}: {
  promise: ReadPromise & { books: Book[] }
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border p-2">
    </div>
  )
}
