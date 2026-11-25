"use server";

import YAML from "yaml";
import { db } from "../db";
import { exportDataSchema } from "../export";
import { validateRequest } from "../server-validate-request";

export async function exportData(input: unknown) {
  const requested = exportDataSchema.safeParse(input);
  if (!requested.success) return { error: "Выберите данные и формат экспорта" };
  const requestedData = requested.data;

  const { user } = await validateRequest();
  if (!user) {
    return { error: "Не авторизован" };
  }

  const now = new Date();
  const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const canExport = await db.user.findFirst({
    where: {
      id: user.id,
      OR: [{ lastExport: null }, { lastExport: { lte: cutoff } }],
    },
    select: { id: true },
  });
  if (!canExport) {
    return {
      error: "Повторный экспорт доступен через 48 часов после предыдущего",
    };
  }

  let results = {};
  if (requestedData.data.includes("books")) {
    const { fetchBooks } = await import("../books");
    results = {
      ...results,
      books: await fetchBooks(user.id),
    };
  }

  if (requestedData.data.includes("journal")) {
    results = {
      ...results,
      journal: await db.readEvent.findMany({
        where: {
          book: {
            userId: user.id,
          },
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
            },
          },
        },
        orderBy: {
          readAt: "desc",
        },
      }),
    };
  }

  if (requestedData.data.includes("groups")) {
    results = {
      ...results,
      groups: await db.group.findMany({
        where: { members: { some: { userId: user.id } } },
        include: {
          members: {
            include: {
              user: {
                select: {
                  username: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
    };
  }

  if (requestedData.data.includes("collections")) {
    const collections = await db.collection.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        books: {
          where: { userId: user.id },
          select: { id: true, title: true, author: true },
        },
      },
      orderBy: { name: "asc" },
    });
    results = { ...results, collections };
  }

  if (requestedData.data.includes("profile")) {
    const {
      username,
      firstName,
      lastName,
      avatarUrl,
      shareFollowers,
      shareSubscriptions,
      shareStats,
      hideActivity,
    } = user;
    results = {
      ...results,
      profile: {
        username,
        firstName,
        lastName,
        avatarUrl,
        shareFollowers,
        shareSubscriptions,
        shareStats,
        hideActivity,
      },
    };
  }

  const text =
    requestedData.format === "json"
      ? JSON.stringify(results, null, 2)
      : YAML.stringify(results);

  const saved = await db.user.updateMany({
    where: {
      id: user.id,
      OR: [{ lastExport: null }, { lastExport: { lte: cutoff } }],
    },
    data: { lastExport: new Date() },
  });
  if (saved.count === 0) {
    return {
      error: "Повторный экспорт доступен через 48 часов после предыдущего",
    };
  }

  return { data: Buffer.from(text).toString("base64") };
}
