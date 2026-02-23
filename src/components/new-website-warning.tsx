"use client";

import { useEffect, useState } from "react";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NewWebsiteWarning({ className }: { className?: string }) {
  // 1. Add state to control visibility
  const [showWarning, setShowWarning] = useState(false);

  // 2. Use useEffect to check the window object only on the client-side
  useEffect(() => {
    if (
      window.location.hostname === "rj-ten.vercel.app" ||
      window.location.hostname === "rjrj.ru"
    ) {
      setShowWarning(true);
    }
  }, []);

  // 3. Return null during server-side rendering and initial client render
  if (!showWarning) {
    return null;
  }

  return (
    <Alert
      className={cn(
        "max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50",
        className,
      )}
    >
      <AlertTriangleIcon />
      <AlertTitle>Переход на новый сайт</AlertTitle>
      <AlertDescription className="text-xs text-black/60 dark:text-white/60">
        Читательский Дневник переходит на новый сайт. Все данные уже
        скопированы, изменения на этом сайте не отобразятся на том.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="default" asChild>
          <Link href="https://rj.markerbit.dev">Перейти</Link>
        </Button>
      </AlertAction>
    </Alert>
  );
}
