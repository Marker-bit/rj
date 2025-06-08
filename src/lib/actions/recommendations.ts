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
  }
) {
  await db.recommendation.update({
    where: {
      id
    },
    data: {
      ...info,
    },
  });

  return { message: "Рекомендация обновлена" };
}
