import { describe, expect, it } from "vitest";

import { parseBookFields } from "./book-fields";

describe("parseBookFields", () => {
  it("passes an array of valid fields through", () => {
    const fields = [
      { title: "Издательство", value: "АСТ" },
      { title: "Год", value: "2024" },
    ];
    expect(parseBookFields(fields)).toEqual(fields);
  });

  it("parses a JSON string of valid fields", () => {
    const fields = [{ title: "Переводчик", value: "Иванов" }];
    expect(parseBookFields(JSON.stringify(fields))).toEqual(fields);
  });

  it("returns [] for malformed JSON instead of throwing", () => {
    expect(parseBookFields("{not json")).toEqual([]);
    expect(parseBookFields('"just a string"')).toEqual([]);
    expect(parseBookFields("42")).toEqual([]);
  });

  it("returns [] for null, undefined and an empty string", () => {
    expect(parseBookFields(null)).toEqual([]);
    expect(parseBookFields(undefined)).toEqual([]);
    expect(parseBookFields("")).toEqual([]);
    expect(parseBookFields("   ")).toEqual([]);
  });

  it("drops non-string entries from mixed arrays", () => {
    const fields = [
      { title: "Серия", value: "Классика" },
      { title: 123, value: "строка" },
      { title: "нет значения" },
      "мусор",
      null,
    ];
    expect(parseBookFields(fields)).toEqual([
      { title: "Серия", value: "Классика" },
    ]);
  });
});
