"use server";

import { db } from "../db";
import { validateRequest } from "../server-validate-request";

export async function getCollections() {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Не авторизован" };
  }

  const collections = await db.collection.findMany({
    where: {
      userId: user.id,
    },
    include: {
      books: true,
      user: false,
    },
  });

  return { collections };
}

export async function createCollection(name: string) {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Не авторизован" };
  }

  const collection = await db.collection.create({
    data: {
      name,
      userId: user.id,
    },
  });

  return { collection, message: "Коллекция создана" };
}

export async function deleteCollection(id: string) {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Не авторизован" };
  }

  await db.collection.delete({
    where: { id, userId: user.id },
  });

  return { message: "Коллекция удалена" };
}
