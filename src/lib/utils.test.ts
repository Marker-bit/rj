import { describe, expect, it } from "vitest";

import { capitalizeFirstLetter, declOfNum } from "./utils";

const words = ["книга", "книги", "книг"];

describe("declOfNum", () => {
  it("declines one", () => {
    expect(declOfNum(1, words)).toBe("книга");
  });

  it("declines two", () => {
    expect(declOfNum(2, words)).toBe("книги");
  });

  it("declines five", () => {
    expect(declOfNum(5, words)).toBe("книг");
  });
});

describe("capitalizeFirstLetter", () => {
  it("capitalizes a lowercase word", () => {
    expect(capitalizeFirstLetter("привет")).toBe("Привет");
  });
});
