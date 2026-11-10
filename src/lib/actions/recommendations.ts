"use server";

import { z } from "zod";
import { db } from "../db";
import { requireAdmin } from "../require-admin";

const recommendationSchema = z.object({
  slogan: z.string().min(1),
  bookInfo: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().int().min(1),
  startsOn: z.coerce.date(),
  endsOn: z.coerce.date(),
  published: z.boolean(),
});

export async function addRecommendation(info: {
  slogan: string;
  bookInfo: string;
  title: string;
  author: string;
  pages: number;
  startsOn: Date;
  endsOn: Date;
  published: boolean;
}) {
  await requireAdmin();

  const parsed = recommendationSchema.safeParse(info);
  if (!parsed.success) {
    return { error: "Некорректные данные" };
  }

  await db.recommendation.create({
    data: {
      ...parsed.data,
    },
  });

  return { message: "Рекомендация добавлена" };
}

export async function editRecommendation(
  id: string,
  info: {
    slogan: string;
    bookInfo: string;
    title: string;
    author: string;
    pages: number;
    startsOn: Date;
    endsOn: Date;
    published: boolean;
  },
) {
  await requireAdmin();

  const parsed = recommendationSchema.safeParse(info);
  if (!parsed.success) {
    return { error: "Некорректные данные" };
  }

  await db.recommendation.update({
    where: {
      id,
    },
    data: {
      ...parsed.data,
    },
  });

  return { message: "Рекомендация обновлена" };
}

export async function deleteRecommendation(id: string) {
  await requireAdmin();

  await db.recommendation.delete({
    where: { id },
  });

  return { message: "Рекомендация удалена" };
}

export async function duplicateRecommendation(id: string) {
  await requireAdmin();

  const recommendation = await db.recommendation.findFirstOrThrow({
    where: { id },
  });

  await db.recommendation.create({
    data: {
      ...recommendation,
      id: undefined,
      published: false,
      createdAt: new Date(),
    },
  });

  return { message: "Рекомендация дублирована" };
}
