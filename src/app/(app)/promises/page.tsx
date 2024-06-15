import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import PromiseCard from "./promise-card"

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
      books: true,
    },
  })

  return (
    <div className="m-2 flex flex-col">
      <h1 className="text-3xl font-bold">Обещания</h1>
      {promises.length === 0 && <p>Вы не создали ни одного обещания</p>}
      {promises.map((promise) => (
        <PromiseCard key={promise.id} promise={promise} />
      ))}
    </div>
  )
}
