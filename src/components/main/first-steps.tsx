import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AddBookButton from "@/app/(app)/(books)/books/button";

export default async function FirstSteps() {
  const { user } = await validateRequest();

  const createdBook =
    (await db.book.count({
      where: {
        userId: user?.id,
      },
    })) > 0;

  const markedReading =
    (await db.readEvent.count({
      where: {
        book: {
          userId: user?.id,
        },
      },
    })) > 0;

  const addedCover =
    (await db.book.count({
      where: {
        userId: user?.id,
        coverUrl: {
          not: "",
        },
      },
    })) > 0;

  if (createdBook && markedReading && addedCover) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Первые шаги</CardTitle>
        <CardDescription>
          Чтобы вы лучше освоились в Читательском дневнике
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 min-w-8 min-h-8 max-w-8 max-h-8 items-center justify-center rounded-full",
                createdBook
                  ? "bg-green-500 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
              )}
            >
              {createdBook ? <Check className="size-4" /> : "1"}
            </div>
            Добавить книгу на странице Книги или тут
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 min-w-8 min-h-8 max-w-8 max-h-8 items-center justify-center rounded-full",
                markedReading
                  ? "bg-green-500 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
              )}
            >
              {markedReading ? <Check className="size-4" /> : "2"}
            </div>
            Прочитать несколько страниц и отметить прочтение
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 min-w-8 min-h-8 max-w-8 max-h-8 items-center justify-center rounded-full",
                addedCover
                  ? "bg-green-500 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
              )}
            >
              {addedCover ? <Check className="size-4" /> : "3"}
            </div>
            Добавить обложку
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-secondary p-4">
      <h2 className="text-xl font-bold">Первые шаги</h2>
    </div>
  );
}
