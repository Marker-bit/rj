import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import { FirstStepsCard } from "./first-steps-card";

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
      id: "book",
      completed: createdBook,
      text: "Добавить книгу на странице Книги или тут",
    },
    {
      id: "reading",
      completed: markedReading,
      text: "Прочитать несколько страниц и отметить прочтение",
    },
    {
      id: "cover",
      completed: addedCover,
      text: "Добавить обложку",
      skippable: true,
    },
  ];

  if (steps.every((step) => step.completed)) {
    return null;
  }

  return <FirstStepsCard steps={steps} />;
}
