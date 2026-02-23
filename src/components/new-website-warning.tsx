"use client";

import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NewWebsiteWarning({ className }: { className?: string }) {
  if (
    window.location.hostname === "rj-ten.vercel.app" ||
    window.location.hostname === "rjrj.ru"
  ) {
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
  return null;
}
