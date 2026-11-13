import { describe, expect, it } from "vitest";
import { shouldReportMutationError } from "./mutation-error";

describe("shouldReportMutationError", () => {
  it("reports when no meta is set", () => {
    expect(shouldReportMutationError(undefined)).toBe(true);
  });
  it("suppresses when the mutation handled the error", () => {
    expect(shouldReportMutationError({ errorHandled: true })).toBe(false);
  });
  it("reports when the flag is not exactly true", () => {
    expect(shouldReportMutationError({ errorHandled: false })).toBe(true);
  });
});
