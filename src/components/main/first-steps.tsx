import { Check } from "lucide-react";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const Step = ({
  index,
  text,
  completed,
}: {
  index: number;
  text: string;
  completed: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div
      className={cn(
        "flex size-8 min-w-8 min-h-8 max-w-8 max-h-8 items-center justify-center rounded-full",
        completed
          ? "bg-primary text-white dark:text-black"
          : "bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700",
      )}
    >
      {completed ? <Check className="size-4" /> : index}
    </div>
    {text}
  </div>
);

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

  const steps = [
    {
      completed: createdBook,
      text: "Добавить книгу на странице Книги или тут",
    },
    {
      completed: markedReading,
      text: "Прочитать несколько страниц и отметить прочтение",
    },
    {
      completed: addedCover,
      text: "Добавить обложку",
    },
  ];

  if (steps.find((step) => !step.completed)) {
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
          {steps.map((step, idx) => (
            <Step
              key={step.text}
              index={idx + 1}
              text={step.text}
              completed={step.completed}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
