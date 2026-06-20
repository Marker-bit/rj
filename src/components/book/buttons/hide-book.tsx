import { HelpButton } from "@/components/ui/help-button";
import { hideMutationOptions } from "@/lib/mutations/books";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader } from "lucide-react";

export function HideBookButton({
  bookId,
  isHidden,
  onDone,
}: {
  bookId: string;
  isHidden: boolean;
  onDone: () => void;
}) {
  const hideMutation = useMutation(hideMutationOptions(bookId));

  return isHidden ? (
    <HelpButton
      className="gap-2"
      variant="outline"
      onClick={() => hideMutation.mutate(undefined, { onSuccess: onDone })}
      disabled={hideMutation.isPending}
      helpText="Переместить эту книгу в обычный список книг"
    >
      {hideMutation.isPending ? (
        <Loader className="size-4" />
      ) : (
        <Eye className="size-4" />
      )}
      <div className="max-sm:hidden">Показать</div>
    </HelpButton>
  ) : (
    <HelpButton
      className="gap-2"
      variant="outline"
      onClick={() => hideMutation.mutate(undefined, { onSuccess: onDone })}
      disabled={hideMutation.isPending}
      helpText="Переместить эту книгу в самый низ, например, чтобы отложить её чтение на будущее"
    >
      {hideMutation.isPending ? (
        <Loader className="size-4" />
      ) : (
        <EyeOff className="size-4" />
      )}
      <div className="max-sm:hidden">Скрыть</div>
    </HelpButton>
  );
}
