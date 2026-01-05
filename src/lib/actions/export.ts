"use server";

import { differenceInDays } from "date-fns";
import YAML from "yaml";
import { db } from "../db";
import type { exportDefaultItems } from "../export";
import { validateRequest } from "../server-validate-request";

type ExportDataType = (typeof exportDefaultItems)[number]["value"];

type RequestedData = {
  data: ExportDataType[];
  format: "json" | "yaml";
};

export async function exportData(requestedData: RequestedData) {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Не авторизован" };
  }

  const userDb = await db.user.findUnique({
    where: { id: user.id },
  });
  if (
    userDb?.lastExport &&
    differenceInDays(new Date(), userDb.lastExport) < 2
  ) {
    return {
      error: "Вы не можете экспортировать данные, 48 часов ещё не прошло",
    };
  }

  await db.user.update({
    where: { id: user.id },
    data: { lastExport: new Date() },
  });

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

  let text = "";
  if (requestedData.format === "json") {
    text = JSON.stringify(results, null, 2);
  } else if (requestedData.format === "yaml") {
    text = YAML.stringify(results);
  }
  const base64 = Buffer.from(text).toString("base64");
  return { data: base64 };
}
