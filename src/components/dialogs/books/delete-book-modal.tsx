import type { Book } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Spinner } from "@/components/ui/spinner";
import { deleteMutationOptions } from "@/lib/mutations/books";

export function DeleteBookModal({
  open,
  book,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  book: Book;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const options = deleteMutationOptions(book.id)
  const deleteMutation = useMutation({...options, onSuccess: (...props) => {
    options.onSuccess?.(...props);
    onSuccess?.();
  }});

  return (
    <DrawerDialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Вы уверены?</DialogTitle>
        <DialogDescription>
          Вы удалите книгу &quot;{book.title}&quot; без возможности возврата.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2 flex gap-2 max-sm:flex-col md:ml-auto md:w-fit">
        <Button onClick={() => onOpenChange(false)} variant="outline">
          Отмена
        </Button>

        <Button
          variant="destructive"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending && <Spinner />}
          Удалить
        </Button>
      </div>
    </DrawerDialog>
  );
}
