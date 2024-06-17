"use client"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn, declOfNum } from "@/lib/utils"
import { Book, ReadPromise } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { BookCheck, ChevronDown, Flame } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

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
