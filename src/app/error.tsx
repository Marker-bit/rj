"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const env = process.env.NODE_ENV;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <h1 className="text-xl font-bold">Что-то пошло не так!</h1>
      {env === "development" && (
        <>
          {error.message && (
            <p className="text-muted-foreground">{error.message}</p>
          )}
          {error.stack && (
            <pre className="w-4/5 overflow-auto rounded-xl border bg-muted p-2">
              {error.stack}
            </pre>
          )}
        </>
      )}

      <Button onClick={() => reset()} className="mt-2">
        Попробовать ещё раз
      </Button>
    </div>
  );
}
