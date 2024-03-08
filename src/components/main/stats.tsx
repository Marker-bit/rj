import { BarChartBig, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Stats as StatsData } from "@/components/stats";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export async function Stats() {
  const { user } = await validateRequest();
  if (!user) return;
  const profile = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });
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
  });
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
      <Link href="/profile#stats">
        <h2 className="text-3xl font-black flex gap-1 items-center cursor-pointer hover:text-black/70 w-fit flex-wrap">
          <BarChartBig className="w-8 h-8 mr-1" />
          Статистика
          <ChevronRight className="w-8 h-8" />
        </h2>
      </Link>
      <StatsData profile={profile} events={events} />
    </div>
  );
}
