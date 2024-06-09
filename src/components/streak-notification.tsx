"use client"

import { getStreak, goodNumbers } from "@/lib/stats"
import { declOfNum } from "@/lib/utils"
import { ReadEvent } from "@prisma/client"
import { User } from "lucia"
import { Flame, PartyPopper } from "lucide-react"

const happyWords = [
  "Так держать!",
  "Отлично!",
  "Круто!",
  "Прекрасно!",
  "Восхитительно!",
  "Супер!",
  "Вот это сила воли!",
]

export default function StreakNotification({
  events,
}: {
  events: ReadEvent[]
  user: User
}) {
  const streak = getStreak(events)
  // if (!goodNumbers.includes(streak)) return null
  const randomWordIndex = Math.floor(Math.random() * happyWords.length)
  const randomWord = happyWords[randomWordIndex]

  return (
    <div className="m-2 flex flex-col rounded-xl bg-orange-500 p-2 text-white">
      <div className="flex items-center gap-1 text-xl font-bold">
        <Flame className="size-6" />
        Чтение подряд
      </div>
      <div className="flex gap-4">
        <div className="flex w-min flex-col items-end -space-y-2">
          <div className="text-7xl font-bold">{streak}</div>
          <div className="ml-auto text-xl opacity-75">
            {declOfNum(streak, ["день", "дня", "дней"])}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{randomWord}</h1>
          <p>Поздравляем с достижением!</p>
        </div>
      </div>
    </div>
  )
}
