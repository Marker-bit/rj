"use client";

import { getStreak } from "@/lib/stats";
import { declOfNum } from "@/lib/utils";
import { ReadEvent } from "@prisma/client";
import { User } from "lucia";
import { PartyPopper } from "lucide-react";

export async function StreakCounter({
  events,
  user,
}: {
  events: ReadEvent[];
  user: User;
}) {
  const streak = getStreak(events);

  if (
    (streak % 50 !== 0 && user.id !== "clsqfrmec000013rgpmmb8eok") ||
    streak === 0
  ) {
    return <></>;
  }

  return (
    <div className="m-2 flex gap-2 overflow-hidden rounded-xl bg-orange-500 p-2 text-white">
      <div className="text-9xl font-bold">{streak}</div>
      <div className="max-sm:hidden">
        <div className="text-2xl font-bold">Ваша активность</div>
        <div className="text-lg">Сколько дней вы читаете подряд</div>
      </div>
      <div className="hidden max-sm:block">
        <div className="text-2xl font-bold">
          {declOfNum(streak, ["день", "дня", "дней"])} 
          подряд
        </div>
      </div>
      <div className="ml-auto mt-auto translate-x-8 translate-y-8">
        <PartyPopper className="size-32 -scale-x-100 text-orange-200" />
      </div>
    </div>
  );
}
