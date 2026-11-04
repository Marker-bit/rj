"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-4 text-center">
      <h1 className="text-3xl font-bold">Что-то пошло не так!</h1>
      <p className="text-muted-foreground">
        Произошла ошибка. Попробуйте ещё раз.
      </p>
      <Button onClick={() => reset()} className="mt-2">
        Попробовать снова
      </Button>
    </div>
  );
}
