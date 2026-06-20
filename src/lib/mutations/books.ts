import { mutationOptions } from "@tanstack/react-query";
import { endOfDay, isToday } from "date-fns";
import { toast } from "sonner";
import { apiFetch } from "../api-fetch";

export const deleteMutationOptions = (bookId: string) =>
  mutationOptions({
    mutationFn: () =>
      apiFetch(`/api/books/${bookId}/`, {
        method: "DELETE",
      }),
    onSuccess: () => toast.success("Книга удалена"),
  });

export const undoEventMutationOptions = (bookId: string) =>
  mutationOptions({
    mutationFn: () =>
      apiFetch(`/api/books/${bookId}/undo`, {
        method: "DELETE",
      }),
    onSuccess: () => toast.success("Событие отменено"),
  });

export const doneMutationOptions = (bookId: string, bookPages: number) =>
  mutationOptions({
    mutationFn: async ({ readAt }: { readAt?: Date }) => {
      await apiFetch(`/api/books/${bookId}/read/`, {
        method: "POST",
        body: JSON.stringify({
          pages: bookPages,
          readAt: readAt
            ? isToday(readAt)
              ? new Date()
              : endOfDay(readAt)
            : new Date(),
        }),
      });
    },
    onSuccess: () => toast.success("Книга отмечена как прочитанная"),
  });

export const hideMutationOptions = (bookId: string) =>
  mutationOptions({
    mutationFn: () =>
      apiFetch<{ hidden: boolean }>(`/api/books/${bookId}/hide`, {
        method: "POST",
        type: "json",
      }),
    onSuccess: (data) =>
      toast.success(`Книга ${data.hidden ? "скрыта" : "показана"}`),
  });
