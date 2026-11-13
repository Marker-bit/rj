import { describe, expect, it } from "vitest";

import {
  bookSchema,
  registerSchema,
  resetPasswordSchema,
  settingsSchema,
} from "./schemas";

const validRegistration = {
  username: "reader_1",
  password: "password123",
  firstName: "Иван",
  lastName: "Петров",
};

describe("registerSchema", () => {
  it("accepts a valid payload", () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it("rejects a two-character username", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      username: "ab",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a seven-character password", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: "1234567",
    });

    expect(result.success).toBe(false);
  });
});

describe("settingsSchema", () => {
  const validSettings = {
    username: "reader_1",
    firstName: "Иван",
    lastName: "",
    avatarUrl: "",
    shareSubscriptions: "NONE" as const,
    shareFollowers: "NONE" as const,
    shareStats: "NONE" as const,
    hideActivity: false,
  };

  it("accepts valid usernames", () => {
    for (const username of ["reader_1", "a.b-c", "abcdefghijklmno"]) {
      expect(
        settingsSchema.safeParse({ ...validSettings, username }).success,
      ).toBe(true);
    }
  });

  it("rejects a two-character username", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      username: "ab",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a sixteen-character username", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      username: "abcdefghijklmnop",
    });

    expect(result.success).toBe(false);
  });

  it("rejects Cyrillic characters", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      username: "читатель",
    });

    expect(result.success).toBe(false);
  });

  it("rejects spaces", () => {
    const result = settingsSchema.safeParse({
      ...validSettings,
      username: "reader 1",
    });

    expect(result.success).toBe(false);
  });

  it("accepts an empty last name and a missing avatar", () => {
    const { avatarUrl, ...settingsWithoutAvatar } = validSettings;
    expect(avatarUrl).toBe("");

    const result = settingsSchema.safeParse({
      ...settingsWithoutAvatar,
      lastName: "",
    });

    expect(result.success).toBe(true);
  });
});

describe("bookSchema", () => {
  const validBook = {
    title: "Название",
    author: "Автор",
    pages: 100,
    fields: [],
  };

  it("rejects zero pages", () => {
    const result = bookSchema.safeParse({ ...validBook, pages: 0 });

    expect(result.success).toBe(false);
  });

  it("coerces a numeric string into a number", () => {
    const result = bookSchema.safeParse({ ...validBook, pages: "12" });

    expect(result.success).toBe(true);
    expect(result.data?.pages).toBe(12);
  });
});

describe("resetPasswordSchema", () => {
  const validReset = {
    username: "reader_1",
    password: "password123",
    confirmPassword: "password123",
    book1: { title: "Война и мир", author: "Лев Толстой" },
    book2: { title: "Преступление и наказание", pages: 480 },
    book3: { title: "Мастер и Маргарита", author: "Михаил Булгаков" },
  };

  it("accepts a valid payload with three distinct books", () => {
    expect(resetPasswordSchema.safeParse(validReset).success).toBe(true);
  });

  it("rejects a seven-character password", () => {
    const result = resetPasswordSchema.safeParse({
      ...validReset,
      password: "1234567",
      confirmPassword: "1234567",
    });

    expect(result.success).toBe(false);
  });

  it("rejects mismatched confirmPassword", () => {
    const result = resetPasswordSchema.safeParse({
      ...validReset,
      confirmPassword: "different123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a book with neither author nor pages", () => {
    const result = resetPasswordSchema.safeParse({
      ...validReset,
      book2: { title: "Преступление и наказание" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only title", () => {
    const result = resetPasswordSchema.safeParse({
      ...validReset,
      book1: { title: "   ", author: "Лев Толстой" },
    });

    expect(result.success).toBe(false);
  });

  it("accepts books identified by title + pages and by title + author", () => {
    const result = resetPasswordSchema.safeParse({
      ...validReset,
      book1: { title: "Война и мир", pages: 1225 },
      book2: { title: "Преступление и наказание", author: "Фёдор Достоевский" },
      book3: { title: "Мастер и Маргарита", pages: 480 },
    });

    expect(result.success).toBe(true);
  });
});
