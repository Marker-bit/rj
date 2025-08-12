"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { getMonth, startOfDay } from "date-fns"
import { ru } from "date-fns/locale"
import { Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Loader } from "../../ui/loader"
import confetti from "canvas-confetti"

export function DateDoneModal({
  isOpen,
  setIsOpen,
  readDoneMutation,
  book,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  readDoneMutation: any
  book: { readEvents: { readAt: Date }[] }
}) {
  const today = new Date()
  const [date, setDate] = useState<Date | undefined>(today)

  const days: Date[] = []

  for (const event of book.readEvents) {
    const date = startOfDay(event.readAt)
    if (!days.includes(date)) {
      days.push(date)
    }
  }

  const handleClose = (b: boolean) => {
    if (b) {
      setIsOpen(true)
      return
    }
    setDate(new Date())
    setIsOpen(false)
  }

  return (
    <DrawerDialog open={isOpen} onOpenChange={handleClose}>
      <DialogHeader className="mb-2">
        <DialogTitle>Отметить книгу прочитанной</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              setDate(newDate)
            }
          }}
          className="w-fit rounded-md border max-sm:w-full"
          disabled={{ after: today }}
          weekStartsOn={1}
          locale={ru}
          modifiers={{ events: days }}
          modifiersClassNames={{
            events: "underline decoration-2 decoration-green-500",
          }}
        />
      </div>

      <Button
        onClick={async (evt) => {
          if (!date) {
            toast.error("Вы не выбрали дату")
            return
          }
          await readDoneMutation.mutate({ readAt: date })
          console.log(evt.screenX, evt.screenY)
          confetti({
            particleCount: 100,
            origin: {
              x: evt.screenX / window.innerWidth,
              y: evt.screenY / window.innerHeight,
            },
          })
        }}
        className="w-fit max-sm:w-full"
      >
        {readDoneMutation.isPending ? (
          <Loader invert className="mr-2 size-4" />
        ) : (
          <Save />
        )}
        Отметить
      </Button>
    </DrawerDialog>
  )
}
