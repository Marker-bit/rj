import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const deleteMutationOptions = (bookId: string) => mutationOptions({
  mutationFn: () =>
    fetch(`/api/books/${bookId}/`, {
      method: "DELETE",
    }),
  onSuccess: () => {
    toast.success("Книга удалена");
  },
});
