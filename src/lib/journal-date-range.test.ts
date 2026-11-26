import { TZDate } from "@date-fns/tz";
import { describe, expect, it } from "vitest";
import { journalDateBounds } from "./journal-date-range";

describe("journal calendar bounds", () => {
  it("uses Moscow local midnight even though it falls on the preceding UTC date", () => {
    const day = new TZDate(2026, 10, 12, "Europe/Moscow");
    expect(journalDateBounds({ from: day, to: day })).toEqual({
      from: "2026-11-11T21:00:00.000Z",
      until: "2026-11-12T21:00:00.000Z",
    });
  });

  it.each([
    [2, 8, "2026-03-08T05:00:00.000Z", "2026-03-09T04:00:00.000Z"],
    [10, 1, "2026-11-01T04:00:00.000Z", "2026-11-02T05:00:00.000Z"],
  ])(
    "uses the next calendar midnight when the day length changes",
    (month, date, from, until) => {
      const day = new TZDate(2026, month, date, "America/New_York");
      expect(journalDateBounds({ from: day, to: day })).toEqual({
        from,
        until,
      });
    },
  );

  it("keeps incomplete selections open-ended and clears both bounds on reset", () => {
    const day = new TZDate(2026, 10, 12, "Europe/Moscow");
    expect(journalDateBounds({ from: day })).toEqual({
      from: "2026-11-11T21:00:00.000Z",
      until: undefined,
    });
    expect(journalDateBounds({ from: undefined, to: day })).toEqual({
      from: undefined,
      until: "2026-11-12T21:00:00.000Z",
    });
    expect(journalDateBounds(undefined)).toEqual({
      from: undefined,
      until: undefined,
    });
  });
});
