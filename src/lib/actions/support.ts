"use server";

import { db } from "../db";
import { validateRequest } from "../server-validate-request";

export async function deleteQuestion(id: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.supportQuestion.delete({
    where: { id, fromUserId: user.admin ? undefined : user.id },
  });
}

export async function markAsDone(id: string, done: boolean) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.supportQuestion.update({
    where: { id, fromUserId: user.admin ? undefined : user.id },
    data: { isDone: done },
  });
}

export async function markAsRead(id: string) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: "Не авторизован" };
  }

  const answer = await db.supportAnswer.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      question: true,
      read: true,
    },
  });

  if (answer.question.fromUserId !== user.id && !user.admin) {
    return { message: "Недостаточно прав" };
  }
  if (answer.read.find((r) => r.userId === user.id)) {
    await db.answerRead.deleteMany({
      where: {
        userId: user.id,
        answerId: id,
      },
    });

    return { message: "Отмечено непрочитанным" };
  } else {
    await db.supportAnswer.update({
      where: {
        id,
      },
      data: {
        read: {
          create: {
            userId: user.id,
          },
        },
      },
    });

    return { message: "Отмечено прочитанным" };
  }
}

export async function answerQuestion(id: string, content: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const question = await db.supportQuestion.findFirstOrThrow({
    where: {
      id,
    },
  });

  if (question.fromUserId !== user.id && !user.admin) {
    return { error: "Недостаточно прав" };
  }

  await db.supportAnswer.create({
    data: {
      content,
      questionId: id,
      fromUserId: user.id,
      read: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  return { message: "Ответ отправлен" };
}

export async function createQuestion(title: string, content: string) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: "Не авторизован" };
  }

  await db.supportQuestion.create({
    data: {
      title,
      content,
      fromUserId: user.id,
    },
  });

  return { message: "Вопрос отправлен" };
}
