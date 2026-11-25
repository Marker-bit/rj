import { describe, expect, it } from "vitest";

import {
  getLastReadProgress,
  getReadingState,
  isBookComplete,
  type ReadingEventLike,
} from "./reading-events";

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

    expect(getReadingState([lastInInput, firstInInput]).latest).toBe(
      lastInInput,
    );
    expect(getReadingState([firstInInput, lastInInput]).latest).toBe(
      lastInInput,
    );
  });
});

describe("book progress", () => {
  const higher = event("higher", 80, "2026-01-01T00:00:00Z");
  const lower = event("lower", 20, "2026-01-03T00:00:00Z");

  it("treats an overshoot as complete and a missing or invalid total as incomplete", () => {
    expect(isBookComplete({ pages: 75, readEvents: [lower, higher] })).toBe(
      true,
    );
    expect(isBookComplete({ pages: 100, readEvents: [lower, higher] })).toBe(
      false,
    );
    expect(isBookComplete({ pages: 0, readEvents: [higher] })).toBe(false);
    expect(isBookComplete({ pages: 80, readEvents: [] })).toBe(false);
  });

  it("chooses the latest unfinished book and displays its furthest page", () => {
    const completed = {
      pages: 75,
      readEvents: [higher, event("latest", 10, "2026-01-04T00:00:00Z")],
    };
    const expected = { pages: 100, readEvents: [lower, higher] };
    const older = {
      pages: 200,
      readEvents: [event("middle", 110, "2026-01-02T00:00:00Z")],
    };
    expect(getLastReadProgress([completed, older, expected])).toEqual({
      book: expected,
      pages: 80,
    });
    expect(
      getLastReadProgress([completed, { pages: 100, readEvents: [] }]),
    ).toBeNull();
  });
});
