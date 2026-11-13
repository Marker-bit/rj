"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-4 text-center">
      <h1 className="text-3xl font-bold">Что-то пошло не так!</h1>
      <p className="text-muted-foreground">
        Произошла ошибка. Попробуйте ещё раз.
      </p>
      <div className="mt-2 flex gap-2">
        <Button onClick={() => reset()}>Попробовать снова</Button>
        <Button variant="outline" asChild>
          <Link href="/home">На главную</Link>
        </Button>
      </div>
    </div>
  );
}
