import { useMutation } from "@tanstack/react-query";
import { Loader, Undo } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../../ui/button";
import { dateToString } from "@/lib/date";
import { undoEventMutationOptions } from "@/lib/mutations/books";

export function UndoEventButton({
  bookId,
  eventId,
  eventDate,
  onDone,
}: {
  bookId: string;
  eventId: string;
  eventDate: Date | string;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const undoEventMutation = useMutation({
    ...undoEventMutationOptions(bookId, eventId),
    onSuccess: () => {
      setOpen(false);
      onDone();
    },
  });
  const label = dateToString(new Date(eventDate));

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Отменить событие от ${label}`}
          disabled={undoEventMutation.isPending}
          className="size-8 p-1"
        >
          {undoEventMutation.isPending ? (
            <Loader className="size-4" />
          ) : (
            <Undo className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Отменить событие?</AlertDialogTitle>
          <AlertDialogDescription>
            Событие от {label} будет удалено, прогресс вернётся к предыдущему
            значению. Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={undoEventMutation.isPending}>
            Отмена
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={undoEventMutation.isPending}
            onClick={() => undoEventMutation.mutate()}
          >
            Удалить событие
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
