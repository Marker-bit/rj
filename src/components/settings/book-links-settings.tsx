"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteBookLink, listBookLinks } from "@/lib/actions/books";
import { revalidate } from "@/lib/actions/revalidate";

const bookLinksKey = ["settings", "book-links"];

export function BookLinksSettings({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const links = useQuery({
    queryKey: [...bookLinksKey, userId],
    staleTime: 0,
    queryFn: () => listBookLinks(),
    meta: { errorHandled: true },
  });
  const revoke = useMutation({
    mutationFn: deleteBookLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookLinksKey });
      void queryClient.invalidateQueries({ queryKey: ["books"] });
      void revalidate("books");
      toast.success("Доступ по ссылке закрыт");
    },
    onError: () => toast.error("Не удалось отозвать ссылку"),
    meta: { errorHandled: true },
  });

  return (
    <section
      className="space-y-3 rounded-lg border p-4"
      aria-labelledby="book-links-title"
    >
      <h3 className="font-medium" id="book-links-title">
        Ссылки на книги
      </h3>
      {links.isPending && (
        <p role="status" className="text-sm text-muted-foreground">
          Загрузка ссылок…
        </p>
      )}
      {links.isError && (
        <Button type="button" variant="outline" onClick={() => links.refetch()}>
          Повторить загрузку ссылок
        </Button>
      )}
      {links.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Вы ещё не делились книгами по ссылке.
        </p>
      )}
      {links.data && links.data.length > 0 && (
        <ul className="divide-y">
          {links.data.map(({ id, book }) => (
            <li key={id} className="space-y-2 py-3">
              <p className="text-sm font-medium break-words">{book.title}</p>
              <p className="text-sm text-muted-foreground break-words">
                {book.author}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/sharedbook/${id}`}
                    target="_blank"
                    rel="noopener"
                  >
                    Открыть ссылку
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={revoke.isPending}
                    >
                      Отозвать ссылку
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Отозвать ссылку?</AlertDialogTitle>
                      <AlertDialogDescription>
                        По этой ссылке больше нельзя будет открыть книгу «
                        {book.title}».
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel type="button">
                        Отмена
                      </AlertDialogCancel>
                      <AlertDialogAction
                        type="button"
                        onClick={() => revoke.mutate(id)}
                      >
                        Отозвать
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
