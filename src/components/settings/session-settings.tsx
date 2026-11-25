"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  listActiveSessions,
  revokeSession,
} from "@/lib/actions/account-security";

export const activeSessionsKey = ["settings", "active-sessions"];

export function SessionSettings({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const sessions = useQuery({
    queryKey: [...activeSessionsKey, userId],
    staleTime: 0,
    queryFn: () => listActiveSessions(),
    meta: { errorHandled: true },
  });
  const revoke = useMutation({
    mutationFn: revokeSession,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: activeSessionsKey }),
    onError: () => toast.error("Не удалось завершить сеанс"),
    meta: { errorHandled: true },
  });

  return (
    <section
      className="space-y-3 rounded-lg border p-4"
      aria-labelledby="active-sessions-title"
    >
      <h3 className="font-medium" id="active-sessions-title">
        Активные сеансы
      </h3>
      {sessions.isPending && (
        <p role="status" className="text-sm text-muted-foreground">
          Загрузка сеансов…
        </p>
      )}
      {sessions.isError && (
        <Button
          type="button"
          variant="outline"
          onClick={() => sessions.refetch()}
        >
          Повторить загрузку сеансов
        </Button>
      )}
      {sessions.data && (
        <ul className="divide-y">
          {sessions.data.map((session) => (
            <li
              key={session.reference}
              className="flex flex-wrap items-center justify-between gap-2 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {session.current ? "Этот браузер" : session.browser}
                </p>
                <p className="text-sm text-muted-foreground">
                  {session.createdAt
                    ? `Вход ${new Intl.DateTimeFormat("ru", { dateStyle: "medium", timeStyle: "short" }).format(session.createdAt)}`
                    : "Время входа неизвестно"}
                </p>
              </div>
              {!session.current && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={revoke.isPending}
                  onClick={() => revoke.mutate(session.reference)}
                >
                  Завершить сеанс
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
