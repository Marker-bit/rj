import { PagesButtonGroup } from "@/components/dialogs/books/read/pages-button-group";
import { Calendar } from "@/components/ui/calendar";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { useMutation } from "@tanstack/react-query";
import { endOfDay, isToday, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export function DateReadModal({
  isOpen,
  setIsOpen,
  onSuccess,
  book,
  lastEvent,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => void;
  book: { readEvents: { readAt: Date }[]; id: string };
  lastEvent?: { pagesRead: number };
}) {
  const readDateMutation = useMutation({
    mutationFn: ({ date, pages }: { date: Date; pages: number }) =>
      fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: pages,
          readAt: isToday(date) ? new Date() : endOfDay(date),
        }),
      }),
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Событие сохранено");
      onSuccess?.();
    },
  });

  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [changePages, setChangePages] = useState<number | "">(
    lastEvent?.pagesRead ?? "",
  );
  const input = useRef<HTMLInputElement>(null);

  const days = useMemo(() => {
    const days: Date[] = [];
    for (const event of book.readEvents) {
      const date = startOfDay(event.readAt);
      if (!days.includes(date)) {
        days.push(date);
      }
    }
    return days;
  }, [book]);

  const handleClose = (b: boolean) => {
    if (b) {
      input.current?.focus();
      setIsOpen(true);
      return;
    }
    setDate(new Date());
    setChangePages(lastEvent?.pagesRead ?? 0);
    setIsOpen(false);
  };

  return (
    <DrawerDialog open={isOpen} onOpenChange={handleClose}>
      <DialogHeader className="mb-2">
        <DialogTitle>Отметить прочтение</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              setDate(newDate);
            }
          }}
          className="rounded-md border w-full"
          disabled={{ after: today }}
          weekStartsOn={1}
          locale={ru}
          modifiers={{ events: days }}
          modifiersClassNames={{
            events: "underline decoration-2 decoration-green-500",
          }}
        />
        {/* добавить captionLayout? */}
        <form
          onSubmit={async (evt) => {
            evt.preventDefault();
            if (!date) {
              toast.error("Выберите дату");
              return;
            }
            if (!changePages) {
              toast.error("Укажите количество страниц");
              return;
            }
            if (changePages < 1) {
              toast.error("Количество страниц должно быть больше 0");
              return;
            }
            if (isNaN(changePages)) {
              toast.error("Количество страниц должно быть числом");
              return;
            }
            await readDateMutation.mutateAsync({ date, pages: changePages });
          }}
        >
          <PagesButtonGroup
            value={changePages}
            setValue={setChangePages}
            isPending={readDateMutation.isPending}
            lastPages={lastEvent?.pagesRead}
          />
        </form>
      </div>
    </DrawerDialog>
  );
}
