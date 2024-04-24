import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { getStreak } from "@/lib/stats";
import { PartyPopper } from "lucide-react";
import { StreakCounter } from "./streak-counter";

export async function StreakInfo() {
  const { user } = await validateRequest();
  if (!user) return null;

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
      readAt: "desc",
    },
  });

  return (
    <StreakCounter events={events} user={user} />
  );
}
