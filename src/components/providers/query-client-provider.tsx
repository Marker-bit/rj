"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { shouldReportMutationError } from "@/lib/mutation-error";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
        queryCache: new QueryCache({
          onError: () => {
            toast.error("Не удалось загрузить данные");
          },
        }),
        mutationCache: new MutationCache({
          onError: (_error, _variables, _context, mutation) => {
            if (!shouldReportMutationError(mutation.meta)) return;
            toast.error("Не удалось выполнить действие", {
              description: "Проверьте соединение и попробуйте ещё раз.",
            });
          },
        }),
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
