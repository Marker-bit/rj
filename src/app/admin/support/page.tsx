import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { declOfNum } from "@/lib/utils"
import { Check } from "lucide-react"
import Link from "next/link"

export default async function Support() {
  const { user } = await validateRequest()
  if (!user) return null

  const questions = await db.supportQuestion.findMany({
    include: {
      answers: {
        include: {
          fromUser: true,
          read: true,
        },
      },
    },
  })
  questions.sort((a, b) => a.answers.length - b.answers.length)
  return (
    <div className="m-2 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Поддержка</h1>

      <div className="grid items-stretch gap-2 sm:grid-cols-5">
        {questions.map((question) => (
          <Link href={`/admin/support/${question.id}`} key={question.id}>
            <div className="relative flex h-full flex-col rounded-xl border p-4">
              <div className="text-2xl font-bold">{question.title}</div>
              <div className="text-sm text-black/50 dark:text-white/50">
                {question.answers.length}{" "}
                {declOfNum(question.answers.length, [
                  "ответ",
                  "ответа",
                  "ответов",
                ])}
              </div>
              <div className="absolute right-5 top-5">
                {question.isDone && <Check className="size-4" />}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
