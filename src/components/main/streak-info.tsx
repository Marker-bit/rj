import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import StreakBlock from "./streak-block";

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
      readAt: "asc",
    },
  });

  return <StreakBlock events={events} user={user} />;
}
