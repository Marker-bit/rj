import { useMutation } from "@tanstack/react-query";
import { Button } from "../../ui/button";
import { undoEventMutationOptions } from "@/lib/mutations/books";
import { Loader, Undo } from "lucide-react";

export function UndoEventButton({
  bookId,
  onDone,
}: {
  bookId: string;
  onDone: () => void;
}) {
  const undoEventMutation = useMutation(undoEventMutationOptions(bookId));

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() =>
        undoEventMutation.mutate(undefined, {
          onSuccess: onDone,
        })
      }
      disabled={undoEventMutation.isPending}
      className="size-fit p-1"
    >
      {undoEventMutation.isPending ? (
        <Loader className="size-4" />
      ) : (
        <Undo className="size-4" />
      )}
    </Button>
  );
}
