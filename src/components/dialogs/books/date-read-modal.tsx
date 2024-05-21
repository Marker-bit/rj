"use client"

import { ru } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { useRef, useState } from "react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader, Save } from "lucide-react"
import { addDays } from "date-fns"
import { toast } from "sonner"

export function DateReadModal({
  isOpen,
  setIsOpen,
  readDateMutation,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  readDateMutation: any
}) {
  const tomorrow = addDays(new Date(), 1)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [changePages, setChangePages] = useState<string>("")
  const input = useRef<HTMLInputElement>(null)

  const handleClose = (b: boolean) => {
    if (b) {
      input.current?.focus()
      setIsOpen(true)
      return
    }
    setDate(new Date())
    setChangePages("")
    setIsOpen(false)
  }

  return (
    <DrawerDialog open={isOpen} onOpenChange={handleClose}>
      <DialogHeader className="mb-2">
        <DialogTitle>Отметить прочтение</DialogTitle>
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
        />
        {/* добавить captionLayout? */}
        <form
          onSubmit={(evt) => {
            evt.preventDefault()
            if (!date) {
              toast.error("Выберите дату")
              return
            }
            if (!changePages) {
              toast.error("Укажите количество страниц")
              return
            }
            if (parseInt(changePages) < 1) {
              toast.error("Количество страниц должно быть больше 0")
              return
            }
            if (isNaN(parseInt(changePages))) {
              toast.error("Количество страниц должно быть числом")
              return
            }
            readDateMutation.mutate({ date, pages: parseInt(changePages) })
          }}
        >
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              value={changePages}
              onChange={(evt) => setChangePages(evt.target.value)}
              autoFocus
              ref={input}
            />
            <Button type="submit" disabled={readDateMutation.isPending}>
              {readDateMutation.isPending ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </DrawerDialog>
  )
}
