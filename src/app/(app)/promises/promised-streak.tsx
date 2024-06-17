"use client"
import { declOfNum } from "@/lib/utils";
import { ReadPromise } from "@prisma/client";
import { Flame } from "lucide-react";

export default function PromisedStreak({ promise }: { promise: ReadPromise }) {
  return (
    <>
      <div className="flex items-center gap-2 font-bold">
        <Flame className="size-4" />
        Читать {promise.streakPages}{" "}
        {declOfNum(promise.streakPages!, ["страницу", "страницы", "страниц"])} в
        день
      </div>
    </>
  )
}
