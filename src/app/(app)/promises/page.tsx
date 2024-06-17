import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import PromiseCard from "./promise-card"
import CreatePromise from "./create-promise"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default async function Page() {
  const { user } = await validateRequest()
  if (!user) {
    return null
  }
  const userId = user.id
  const promises = await db.readPromise.findMany({
    where: {
      userId,
    },
    include: {
      books: {
        include: {
          readEvents: {
            orderBy: {
              readAt: "desc",
            },
          },
        },
      },
    },
  })
  const books = await db.book.findMany({
    where: {
      userId,
    },
  })

  return (
    <div className="m-2 flex flex-col">
      <h1 className="text-3xl font-bold">Обещания</h1>
      <CreatePromise books={books} />
      {promises.length === 0 && (
        <p className="mt-2">Вы не создали ни одного обещания</p>
      )}
      <div className="mt-2 flex flex-col gap-2">
        {promises.map((promise) => (
          <Suspense
            fallback={<Skeleton className="h-44 w-full" />}
            key={promise.id}
          >
            <PromiseCard promise={promise} />
          </Suspense>
        ))}
      </div>
    </div>
  )
}
