"use server";

import { db } from "../db";

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
  await db.recommendation.create({
    data: {
      ...info,
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
  await db.recommendation.update({
    where: {
      id,
    },
    data: {
      ...info,
    },
  });

  return { message: "Рекомендация обновлена" };
}

export async function deleteRecommendation(id: string) {
  await db.recommendation.delete({
    where: { id },
  });

  return { message: "Рекомендация удалена" };
}

export async function duplicateRecommendation(id: string) {
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
