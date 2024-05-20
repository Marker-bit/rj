import { BarChartBig, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Stats as StatsData } from "@/components/users/stats"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"

export async function Stats() {
  const { user } = await validateRequest()
  if (!user) return
  const profile = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      follower: true,
      following: true,
    },
  })
  const events = await db.readEvent.findMany({
    where: {
      book: {
        userId: user.id,
      },
    },
    include: {
      book: true,
    },
    orderBy: {
      readAt: "asc",
    },
  })
  return (
    <div className="flex cursor-default flex-col gap-3 border-b p-3">
      <Link href="/profile#stats">
        <h2 className="flex w-fit cursor-pointer flex-wrap items-center gap-1 text-3xl font-black hover:text-black/70 dark:hover:text-white/70">
          <BarChartBig className="mr-1 size-8" />
          Статистика
          <ChevronRight className="size-8" />
        </h2>
      </Link>
      <StatsData profile={profile} events={events} />
    </div>
  )
}
