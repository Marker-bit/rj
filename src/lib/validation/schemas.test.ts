import { describe, expect, it } from "vitest";

import { bookSchema, registerSchema } from "./schemas";

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
