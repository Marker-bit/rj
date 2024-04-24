import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { getStreak } from "@/lib/stats";
import { PartyPopper } from "lucide-react";

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

  const streak = getStreak(events);

  if (streak % 50 !== 0 && user.id !== "clsqfrmec000013rgpmmb8eok") {
    return <></>;
  }

  return (
    <div className="flex gap-2 bg-orange-500 text-white p-2 rounded-xl m-2 overflow-hidden">
      <div className="text-9xl font-bold">{streak}</div>
      <div className="max-sm:hidden">
        <div className="text-2xl font-bold">Ваша активность</div>
        <div className="text-lg">Сколько дней вы читаете подряд</div>
      </div>
      <div className="hidden max-sm:block">
        <div className="text-2xl font-bold">Чтение подряд</div>
      </div>
      <div className="ml-auto mt-auto translate-x-8 translate-y-8">
        <PartyPopper className="w-32 h-32 text-orange-200 -scale-x-100" />
      </div>
    </div>
  );
}
