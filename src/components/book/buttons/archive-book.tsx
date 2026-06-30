import { HelpButton } from "@/components/ui/help-button";
import { archiveMutationOptions } from "@/lib/mutations/books";
import { useMutation } from "@tanstack/react-query";
import { Archive, ArchiveRestore, Loader } from "lucide-react";

export function ArchiveBookButton({
  bookId,
  isArchived,
  onDone,
}: {
  bookId: string;
  isArchived: boolean;
  onDone: () => void;
}) {
  const archiveMutation = useMutation(archiveMutationOptions(bookId));

  return isArchived ? (
    <HelpButton
      className="gap-2"
      variant="outline"
      onClick={() => archiveMutation.mutate(undefined, { onSuccess: onDone })}
      disabled={archiveMutation.isPending}
      helpText="Переместить эту книгу в обычный список книг"
    >
      {archiveMutation.isPending ? (
        <Loader className="size-4" />
      ) : (
        <ArchiveRestore className="size-4" />
      )}
      <div className="max-sm:hidden">Вернуть из архива</div>
    </HelpButton>
  ) : (
    <HelpButton
      className="gap-2"
      variant="outline"
      onClick={() => archiveMutation.mutate(undefined, { onSuccess: onDone })}
      disabled={archiveMutation.isPending}
      helpText="Переместить эту книгу в архив"
    >
      {archiveMutation.isPending ? (
        <Loader className="size-4" />
      ) : (
        <Archive className="size-4" />
      )}
      <div className="max-sm:hidden">В архив</div>
    </HelpButton>
  );
}
