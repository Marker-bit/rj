"use client"

import { setBookColor } from "@/lib/actions/books"
import { backgroundColors } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { BackgroundColor } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { Check, PaletteIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export default function Palette({
  background,
  bookId,
}: {
  background: BackgroundColor
  bookId: string
}) {
  const [chosenBackground, setChosenBackground] =
    useState<BackgroundColor>(background)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const setColor = (color: BackgroundColor) => {
    if (loading) return
    setChosenBackground(color)
  }

  const updateColor = async (color: BackgroundColor) => {
    setLoading(true)
    await setBookColor(bookId, color)
    setLoading(false)
    toast.success("Цвет изменен")
    router.refresh()
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <PaletteIcon className="size-4" />
          <div className="max-sm:hidden">Цвет</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="overflow-hidden">
        <div className="flex flex-wrap gap-2">
          <button
            className="flex items-center rounded-xl border p-2"
            onClick={() => setColor(BackgroundColor.NONE)}
          >
            <div className="size-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <AnimatePresence initial={false}>
              {chosenBackground === BackgroundColor.NONE && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                >
                  <Check className="ml-2 size-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          {backgroundColors.map((color) => (
            <button
              className="flex items-center rounded-xl border p-2"
              onClick={() => setColor(color.type)}
              key={color.type}
            >
              <div className={cn("size-8 rounded-lg", color.color)} />
              <AnimatePresence>
                {chosenBackground === color.type && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                  >
                    <Check className="ml-2 size-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {chosenBackground !== background && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Button
                className="mt-2 flex w-full items-center justify-center"
                disabled={loading}
                onClick={() => updateColor(chosenBackground)}
              >
                Сохранить
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  )
}
