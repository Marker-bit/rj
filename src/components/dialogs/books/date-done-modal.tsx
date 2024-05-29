"use client"

import { ru } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { useRef, useState } from "react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Save } from "lucide-react"
import { addDays, getDate, startOfDay, subYears } from "date-fns"
import { toast } from "sonner"
import { Loader } from "../../ui/loader"

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
  const tomorrow = addDays(new Date(), 1)
  const [date, setDate] = useState<Date | undefined>(new Date())

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
        <DialogTitle>Отметить прочитанную книгу</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-fit rounded-md border max-sm:w-full"
          disabled={[{ from: tomorrow, to: new Date(3000, 1) }]}
          weekStartsOn={1}
          locale={ru}
          fixedWeeks
          toDate={new Date()}
          modifiers={{ events: days }}
          modifiersClassNames={{ events: "bg-green-100 dark:bg-green-800" }}
        />
      </div>

      <Button
        onClick={() => {
          if (!date) {
            toast.error("Вы не выбрали дату")
            return
          }
          readDoneMutation.mutate({ readAt: date })
        }}
        className="w-fit max-sm:w-full"
      >
        {readDoneMutation.isPending ? (
          <Loader invert className="mr-2 size-4" />
        ) : (
          <Save className="mr-2 size-4" />
        )}
        Отметить
      </Button>
    </DrawerDialog>
  )
}
