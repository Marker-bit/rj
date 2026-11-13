import { describe, expect, it } from "vitest";

import { getReadingState, type ReadingEventLike } from "./reading-events";

const event = (
  id: string,
  pagesRead: number,
  readAt: string,
): ReadingEventLike => ({ id, pagesRead, readAt });

describe("getReadingState", () => {
  it("returns empty state for no events", () => {
    expect(getReadingState([])).toEqual({
      first: null,
      latest: null,
      furthest: null,
      progressPages: 0,
    });
  });

  it("returns the earliest and latest events by date from unordered input", () => {
    const earlier = event("earlier", 10, "2026-01-01T00:00:00.000Z");
    const middle = event("middle", 20, "2026-01-02T00:00:00.000Z");
    const later = event("later", 30, "2026-01-03T00:00:00.000Z");

    const state = getReadingState([middle, later, earlier]);

    expect(state.first).toBe(earlier);
    expect(state.latest).toBe(later);
    expect(state.progressPages).toBe(30);
  });

  it("keeps progress at the furthest value when the latest event is a correction", () => {
    const state = getReadingState([
      event("first", 10, "2026-01-01T00:00:00.000Z"),
      event("furthest", 30, "2026-01-02T00:00:00.000Z"),
      event("correction", 20, "2026-01-03T00:00:00.000Z"),
    ]);

    expect(state.latest?.pagesRead).toBe(20);
    expect(state.progressPages).toBe(30);
  });

  it("returns a deterministic latest when events share a date", () => {
    const firstInInput = event("first", 10, "2026-01-01T00:00:00.000Z");
    const lastInInput = event("last", 20, "2026-01-01T00:00:00.000Z");

    const state = getReadingState([firstInInput, lastInInput]);

    expect(state.latest).toBe(lastInInput);
  });
});
