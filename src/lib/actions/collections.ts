"use server";

import { z } from "zod";
import {
  collectionColors,
  isCollectionIcon,
  type CollectionIcon,
} from "../collection-appearance";
import { db } from "../db";
import { validateRequest } from "../server-validate-request";
import { revalidate } from "./revalidate";

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

  const { count } = await db.collection.deleteMany({
    where: { id, userId: user.id },
  });
  if (!count) return { error: "Коллекция недоступна" };
  await revalidate("collections");

  return { message: "Коллекция удалена" };
}

const appearanceSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  icon: z.custom<CollectionIcon>(isCollectionIcon).nullable(),
  color: z
    .string()
    .refine((value) => collectionColors.some((color) => color.value === value))
    .nullable(),
});

export async function updateCollection(input: unknown) {
  const { user } = await validateRequest();
  if (!user) return { error: "Не авторизован" };

  const parsed = appearanceSchema.safeParse(input);
  if (!parsed.success)
    return { error: "Проверьте название, значок и цвет коллекции" };

  const { id, name, icon, color } = parsed.data;
  const { count } = await db.collection.updateMany({
    where: { id, userId: user.id },
    data: { name, icon, color },
  });
  if (!count) return { error: "Коллекция недоступна" };

  await revalidate("books");
  return { message: "Коллекция обновлена" };
}
