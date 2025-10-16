import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import confetti from "canvas-confetti";
import { endOfDay, isToday, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { useMutation } from "@tanstack/react-query";
import { Book } from "@prisma/client";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export function DateDoneModal({
  open,
  setOpen,
  book,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  book: Book & { readEvents: { readAt: Date }[] };
}) {
  const router = useRouter();
  const doneMutation = useMutation({
    mutationFn: async ({ readAt }: { readAt?: Date }) => {
      await fetch(`/api/books/${book.id}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: book.pages,
          readAt: readAt
            ? isToday(readAt)
              ? new Date()
              : endOfDay(readAt)
            : new Date(),
        }),
      });
    },
    onSuccess: () => {
      toast.success("Книга отмечена как прочитанная");
      setOpen(false);
      onSuccess?.();
      router.push(`/books/history?bookReadId=${book.id}`);
    },
  });
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(today);

  const days: Date[] = [];

  for (const event of book.readEvents) {
    const date = startOfDay(event.readAt);
    if (!days.includes(date)) {
      days.push(date);
    }
  }

  const handleClose = (b: boolean) => {
    if (b) {
      setOpen(true);
      return;
    }
    setDate(new Date());
    setOpen(false);
  };

  return (
    <DrawerDialog open={open} onOpenChange={handleClose}>
      <DialogHeader className="mb-2">
        <DialogTitle>Отметить книгу прочитанной</DialogTitle>
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
            toast.error("Вы не выбрали дату");
            return;
          }
          await doneMutation.mutateAsync({ readAt: date });

          confetti({
            particleCount: 100,
            origin: {
              x: evt.screenX / window.innerWidth,
              y: evt.screenY / window.innerHeight,
            },
          });
        }}
        className="w-fit max-sm:w-full"
      >
        {doneMutation.isPending ? <Spinner /> : <Save />}
        Отметить
      </Button>
    </DrawerDialog>
  );
}
