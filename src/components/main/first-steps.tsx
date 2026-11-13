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
      text: "Добавить книгу на странице «Книги»",
      href: "/books",
    },
    {
      id: "reading",
      completed: markedReading,
      text: "Откройте книгу и отметьте, сколько страниц прочитали",
      href: "/books",
    },
    {
      id: "cover",
      completed: addedCover,
      text: "Добавьте обложку при создании или редактировании книги",
      href: "/books",
      skippable: true,
    },
  ];

  if (steps.every((step) => step.completed)) {
    return null;
  }

  return <FirstStepsCard steps={steps} />;
}
