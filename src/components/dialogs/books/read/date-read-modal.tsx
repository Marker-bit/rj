import { useMutation } from "@tanstack/react-query";
import { endOfDay, isToday, startOfDay } from "date-fns";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PagesButtonGroup } from "@/components/dialogs/books/read/pages-button-group";
import { DateCalendar } from "@/components/date-calendar";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";

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
  book: { readEvents: { readAt: Date }[]; id: string; pages: number };
  lastEvent?: { pagesRead: number };
}) {
  const readDateMutation = useMutation({
    mutationFn: async ({ date, pages }: { date: Date; pages: number }) => {
      const response = await fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: pages,
          readAt: isToday(date) ? new Date() : endOfDay(date),
        }),
      });
      if (!response.ok) {
        throw new Error("Не удалось сохранить прочтение");
      }
    },
    onError: () => {
      toast.error("Не удалось сохранить прочтение", {
        description: "Проверьте подключение к интернету и попробуйте ещё раз.",
      });
    },
    meta: { errorHandled: true },
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
    const eventDays: Date[] = [];
    for (const event of book.readEvents) {
      const eventDate = startOfDay(event.readAt);
      if (!eventDays.includes(eventDate)) {
        eventDays.push(eventDate);
      }
    }
    return eventDays;
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
    <DrawerDialog
      open={isOpen}
      onOpenChange={handleClose}
      className="sm:w-[22rem]"
    >
      <DialogHeader className="mb-2">
        <DialogTitle>Отметить прочтение</DialogTitle>
        <DialogDescription>
          Выберите дату и укажите, до какой страницы вы дочитали.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <DateCalendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              setDate(newDate);
            }
          }}
          className="mx-auto rounded-md border max-md:w-full"
          disabled={{ after: today }}
          modifiers={{ events: days }}
          modifiersClassNames={{
            events: "underline decoration-2 decoration-green-500",
          }}
        />
        <form
          onSubmit={(evt) => {
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
            if (Number.isNaN(changePages)) {
              toast.error("Количество страниц должно быть числом");
              return;
            }
            readDateMutation.mutate({ date, pages: changePages });
          }}
        >
          <PagesButtonGroup
            value={changePages}
            setValue={setChangePages}
            isPending={readDateMutation.isPending}
            lastPages={lastEvent?.pagesRead}
            max={book.pages}
          />
        </form>
      </div>
    </DrawerDialog>
  );
}
