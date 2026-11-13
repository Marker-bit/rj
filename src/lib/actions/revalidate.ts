"use server";

import { revalidatePath } from "next/cache";

const pagePaths = {
  books: ["/home", "/books", "/journal", "/activity", "/profile"],
  groups: ["/home", "/groups", "/books", "/activity"],
  profile: ["/profile", "/friends", "/followers", "/activity", "/home"],
  support: ["/support", "/admin/support"],
  admin: [
    "/admin",
    "/admin/users",
    "/admin/books",
    "/admin/support",
    "/admin/recommendations",
  ],
  collections: ["/books"],
  recommendations: ["/home", "/admin/recommendations"],
  settings: ["/profile", "/profile/settings"],
} as const;

const dynamicPagePaths: Partial<Record<keyof typeof pagePaths, string[]>> = {
  books: ["/books/[bookId]"],
  groups: ["/groups/[groupId]"],
  profile: ["/profile/[username]"],
  support: ["/admin/support/[questionId]"],
  admin: ["/admin/users/[userId]", "/admin/support/[questionId]"],
};

export type RevalidationScope = keyof typeof pagePaths;

export async function revalidate(scope: RevalidationScope) {
  if (scope === "books") revalidatePath("/", "layout");
  for (const path of pagePaths[scope]) {
    revalidatePath(path);
  }

  for (const path of dynamicPagePaths[scope] ?? []) {
    revalidatePath(path, "page");
  }
}
