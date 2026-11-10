import { afterEach, describe, expect, it, vi } from "vitest";

import { apiFetch, ApiError } from "./api-fetch";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiFetch", () => {
  it("returns parsed JSON on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(jsonResponse({ ok: true }))),
    );

    const data = await apiFetch<{ ok: boolean }>("/api/test", { type: "json" });

    expect(data).toEqual({ ok: true });
  });

  it("uses the error field for the ApiError message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(jsonResponse({ error: "Не найдено" }, 404))),
    );

    await expect(apiFetch("/api/test", { type: "json" })).rejects.toMatchObject(
      {
        message: "Не найдено",
        status: 404,
      },
    );
  });

  it("throws when JSON was expected but not returned", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response("plain text", {
            status: 200,
            headers: { "content-type": "text/plain" },
          }),
        ),
      ),
    );

    const promise = apiFetch("/api/test", { type: "json" });

    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toThrow("Expected JSON response");
  });

  it("returns undefined for a 204 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(null, {
            status: 204,
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    );

    await expect(
      apiFetch("/api/test", { type: "json" }),
    ).resolves.toBeUndefined();
  });
});
